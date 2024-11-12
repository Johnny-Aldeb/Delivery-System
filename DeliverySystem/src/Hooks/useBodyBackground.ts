import { useEffect } from "react";
import { pngPathBuilder } from "../appUtils.ts";
import {
  BACKGROUND_COLOR_GRADIENT,
  NO_REPEAT,
  BACKGROUND_IMAGE_POSITION_DEFAULT,
} from "../constants.ts";

type UseBodyBackgroundProps = {
  backgroundImage: string;
  backgroundPosition?: string;
  backgroundSize?: string;
};

export const useBodyBackground = ({
  backgroundImage,
  backgroundPosition = BACKGROUND_IMAGE_POSITION_DEFAULT,
  backgroundSize = "50%",
}: UseBodyBackgroundProps): void => {
  useEffect(() => {
    const originalBackground = document.body.style.background;
    const originalBackgroundSize = document.body.style.backgroundSize;
    const originalBackgroundAttachment =
      document.body.style.backgroundAttachment;

    document.body.style.background = `url(${pngPathBuilder(
      backgroundImage
    )}) ${NO_REPEAT} ${backgroundPosition}, ${BACKGROUND_COLOR_GRADIENT}`;
    document.body.style.backgroundSize = backgroundSize;
    document.body.style.backgroundAttachment = "fixed";

    return () => {
      document.body.style.background = originalBackground;
      document.body.style.backgroundSize = originalBackgroundSize;
      document.body.style.backgroundAttachment = originalBackgroundAttachment;
    };
  }, [backgroundImage, backgroundPosition, backgroundSize]);
};
