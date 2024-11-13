import { useEffect } from 'react';
import {pngPathBuilder} from "../appUtils.ts";
import {BACKGROUND_COLOR_GRADIENT, NO_REPEAT, BACKGROUND_IMAGE_POSITION_DEFAULT} from "../constants.ts";
import {EMPTY_STRING} from "../Components/AuthForm/constants.ts";

type UseBodyBackgroundProps = {
    backgroundImage: string;
    backgroundPosition?: string;
    backgroundSize?: string;
};

export const useBodyBackground = ({ backgroundImage, backgroundPosition = BACKGROUND_IMAGE_POSITION_DEFAULT, backgroundSize = 'cover' }: UseBodyBackgroundProps): void => {
    useEffect(() => {
        const originalBackground = document.body.style.background;
        document.body.style.background = `url(${pngPathBuilder(backgroundImage)}) ${NO_REPEAT} ${backgroundPosition}, ${BACKGROUND_COLOR_GRADIENT}`;
        return () => {
            document.body.style.background = originalBackground;
            document.body.style.backgroundSize = EMPTY_STRING;
        };
    }, [backgroundImage, backgroundPosition, backgroundSize]);
};
