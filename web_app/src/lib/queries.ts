"use server"

import { clerkClient, currentUser } from "@clerk/nextjs"
import { db } from "./db";
import { redirect } from "next/navigation";
import { Agency, Plan, User } from "@prisma/client";
import { generateRandomUUID } from "./utils";

export const getAuthUserDetails = async () => {
    const user = await currentUser()
    if (!user) {
        return;
    }
    const userData = db.user.findUnique({
        where: {
            email : user.emailAddresses[0].emailAddress
        },
        include: {
            agency: {
                include: {
                    SideBarOption: true,
                    subAccount: {
                        include: {
                            SidebarOption : true,
                        }
                    }
                }
            },
            Permissions : true,
        }
    })

    return userData;
}

export const saveActivityLogsNotification = async ({
    agencyId,
    description,
    subAccountId,
}: {
        agencyId?: string,
        description: string,
        subAccountId?: string
}) => {
    const authUser = await currentUser();

    let userData
    if (!authUser) {
        const response = await db.user.findFirst({
            where: {
                agency: {
                    subAccount: {
                        some : { id : subAccountId }
                    }
                }
            }
        })
         if (response) {
            userData = response
        } 
    }
    else {
        userData = await db.user.findUnique({
            where: {
                email : authUser?.emailAddresses[0].emailAddress
            }
        })
    }

    if (!userData) {
        console.log("Could not find user");
        return;
    }

    let foundAgencyId = agencyId;
    if (!foundAgencyId) {
        if (!subAccountId) {
            throw new Error("You need to provide at least a subAccountId or an agencyId");
        }
        const response = await db.subAccount.findUnique({
            where: {
                id : subAccountId
            }
        })

        if (response) {
            foundAgencyId = response.agencyId;
        }
    }

    if (subAccountId) {
        await db.notification.create({
            data: {
                id: generateRandomUUID(),
                notification: `${userData.name} | ${description}`,
                User: {
                    connect: {
                        id : userData.id
                    }
                },
                Agency: {
                    connect: {
                        id : foundAgencyId ?? '',
                    }
                },
                SubAccount: {
                    connect: {
                        id : subAccountId
                    }
                }
            }
        })
    }
    else {
        await db.notification.create({
            data: {
                id: generateRandomUUID(),
                notification: `${userData.name} | ${description}`,
                User: {
                    connect: {
                        id : userData.id
                    }
                },
                Agency: {
                    connect: {
                        id : foundAgencyId ?? '',
                    }
                }
            },
        })
    }
}

export const createTeamUser = async (agencyId: string, user : User) => {
    if (user.role === 'AGENCY_OWNER') return null;

    const response = await db.user.create({ data: { ...user } })
    return response;
}

export const verifyAndAcceptInvitation = async () => { 
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const invitationExists = await db.invitation.findUnique({ where: { email: user.emailAddresses[0].emailAddress, status: "PENDING"} })

    if (invitationExists) {
        const userDetails = await createTeamUser(invitationExists.agencyId, {
            email: invitationExists.email,
            agencyId: invitationExists.agencyId,
            avatarUrl: user.imageUrl,
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            role: invitationExists.role,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        await saveActivityLogsNotification({
            agencyId: invitationExists?.agencyId,
            description: `Joined`,
            subAccountId: undefined
        })

        if (userDetails) {
            await clerkClient.users.updateUserMetadata(user.id, {
                privateMetadata: {
                    role : userDetails.role || 'SUBACCOUNT_USER'
                }
            })

            await db.invitation.delete({
                where: {
                    email : userDetails.email
                }
            })

            return userDetails.agencyId
        }
        else{ return null}
    }
    else {
        const agency = await db.user.findUnique({
            where: {
                email : user.emailAddresses[0].emailAddress
            },

        })

        return agency? agency.agencyId : null
    }

}

export const updateAgencyDetails = async (agencyId: string, agencyDetails: Partial<Agency>) => {
    const response = await db.agency.update({
        where: { id: agencyId },
        data: { ...agencyDetails }
    })
    
    return response;
}

export const deleteAgency = async (agencyId: string) => {
    const res = await db.agency.delete({
        where: {
            id : agencyId
        }
    })
}

export const initUser = async (newUser: Partial<User>) => {
    const user = await currentUser();

    if (!user) return;
    const userData = await db.user.upsert({
        where: {
            email : user.emailAddresses[0].emailAddress
        },
        update: newUser,
        create: {
            id: user.id,
            avatarUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            role: newUser.role || 'SUBACCOUNT_USER',
        }
    })

    await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
            role : newUser.role || 'SUBACCOUNT_USER'
        }
    })
    return userData;
}

export const upsertAgency = async (agency: Agency, price?: Plan) => {
  if (!agency.companyEmail) return null
  try {
    const agencyDetails = await db.agency.upsert({
      where: {
        id: agency.id,
      },
        update: {
            address: agency.address,
            agencyLogo: agency.agencyLogo,
            city: agency.city,
            companyPhone: agency.companyPhone,
            country: agency.country,
            name: agency.name,
            companyEmail: agency.companyEmail,
            state: agency.state,
            whiteLabel: agency.whiteLabel,
            zip: agency.zip,
            
        },
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        SideBarOption: {
          create: [
             {
                id : generateRandomUUID(),
              name: 'Dashboard',
              icon: 'category',
              link: `/agency/${agency.id}`,
            },
                {
                id : generateRandomUUID(),
                
              name: 'Launchpad',
              icon: 'clipboardIcon',
              link: `/agency/${agency.id}/launchpad`,
            },
                {
                id : generateRandomUUID(),
                
              name: 'Billing',
              icon: 'payment',
              link: `/agency/${agency.id}/billing`,
            },
                {
                id : generateRandomUUID(),
                
              name: 'Settings',
              icon: 'settings',
              link: `/agency/${agency.id}/settings`,
            },
                {
                id : generateRandomUUID(),
                
              name: 'Sub Accounts',
              icon: 'person',
              link: `/agency/${agency.id}/all-subaccounts`,
            },
                {
                id : generateRandomUUID(),
                
              name: 'Team',
              icon: 'shield',
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    })
    return agencyDetails
  } catch (error) {
    console.log(error)
  }
}

export const getNotificationAndUser = async (agencyId: string) => {
    try {
        const res = await db.notification.findMany({
            where: { agencyId },
            include: { User: true },
            orderBy: {
                createdAt: 'desc'
            },
        })
        return res;
    } catch (err) {
        console.log(err)
    }
}