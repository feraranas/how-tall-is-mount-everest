import React, { useRef } from 'react'
import DataContainer from '../DataContainer/DataContainer';

interface MountainProps {
    src: string;
    top: number;
    zIndex: number;
    name: string;
    altitude: number;
    location: string;
    prominence: number;
    range: string;
    firstAscent: number;
    difficulty: string;
}

export const Mountain: React.FC<MountainProps> = ({
    src,
    top,
    zIndex,
    name,
    altitude,
    location,
    prominence,
    range,
    firstAscent,
    difficulty,
}) => {
    const mountain = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={mountain}
            draggable={false}
            style={{ top: `${top}px`, zIndex, backgroundImage: `url(${src})` }}
            className="flex inset-x-0 mx-auto absolute bg-cover w-[500px] h-[500px]
                        bg-no-repeat bg-center"
        >
            <DataContainer
                name={name}
                altitude={altitude}
                location={location}
                prominence={prominence}
                range={range}
                firstAscent={firstAscent}
                difficulty={difficulty}
            />
        </div>
    );
};
