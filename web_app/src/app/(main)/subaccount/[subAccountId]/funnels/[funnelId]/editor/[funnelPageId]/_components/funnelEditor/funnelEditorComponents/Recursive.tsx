import { EditorElement } from "@/providers/editor/EditorProvider";
import React from "react";
import TextComponent from "./TextComponent";
import Container from "./Container";
import VideoComponent from "./VideoComponent";
import LinkComponent from "./LinkComponent";
import TwoColumns from "./TwoColumns";
import ContactFormComponent from "./ContactFormComponent";

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "container":
      return <Container element={element} />;
    case "__body":
      return <Container element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "link":
      return <LinkComponent element={element} />;
    case "2Col":
      return <TwoColumns element={element} />;
    case "contactForm":
      return <ContactFormComponent element={element} />;
    default:
      null;
  }
};

export default Recursive;
