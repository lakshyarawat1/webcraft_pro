import { Notification, Prisma, Role } from "@prisma/client"
import { getAuthUserDetails, getMedia, getUserPermissions } from "./queries"
import { db } from "./db"

const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
) => {
  return await db.user.findFirst({
    where: { agency: { id: agencyId } },
    include: {
      agency: { include: { subAccount: true } },
      Permissions: { include: { subAccount: true } },
    },
  })
}

export type NotificationWithUser =
  | ({
      User: {
        id: string
        name: string
        avatarUrl: string
        email: string
        createdAt: Date
        updatedAt: Date
        role: Role
        agencyId: string | null
      }
    } & Notification)[]
  | undefined

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<typeof getUserPermissions>

export type AuthUserWithAgencySidebarOptionsSubAccounts = Prisma.PromiseReturnType<typeof getAuthUserDetails>

export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Prisma.PromiseReturnType<
    typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
  >

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>
  
export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput