import React, { useRef } from 'react'
import { mountainConfig } from './Mountains';
import DataContainer from '../DataContainer/DataContainer';

export const Mountain: React.FC<mountainConfig> = ({
    id,
    name,
    altitude,
    location,
    prominence,
    range,
    firstAscent,
    difficulty,
}) => {
    const mountain = useRef<HTMLDivElement | null>(null);
    
    // Cards are spaced 1800px apart in list order (highest first), so none overlap.
    const mountainVariants = {
        "mountain-1": "top-[2500px] w-[500px] h-[500px] bg-mountain-1 z-1",
        "mountain-2": "top-[4300px] w-[500px] h-[500px] bg-mountain-2 z-2",
        "mountain-3": "top-[6100px] w-[500px] h-[500px] bg-mountain-3 z-3",
        "mountain-4": "top-[7900px] w-[500px] h-[500px] bg-mountain-4 z-4",
        "mountain-5": "top-[9700px] w-[500px] h-[500px] bg-mountain-5 z-5",
        "mountain-6": "top-[11500px] w-[500px] h-[500px] bg-mountain-6 z-6",
        "mountain-7": "top-[13300px] w-[500px] h-[500px] bg-mountain-7 z-7",
        "mountain-8": "top-[15100px] w-[500px] h-[500px] bg-mountain-8 z-8",
        "mountain-9": "top-[16900px] w-[500px] h-[500px] bg-mountain-9 z-9",
        "mountain-10": "top-[18700px] w-[500px] h-[500px] bg-mountain-10 z-10",
        "mountain-11": "top-[20500px] w-[500px] h-[500px] bg-mountain-11 z-11",
        "mountain-12": "top-[22300px] w-[500px] h-[500px] bg-mountain-12 z-12",
        "mountain-13": "top-[24100px] w-[500px] h-[500px] bg-mountain-13 z-13",
        "mountain-14": "top-[25900px] w-[500px] h-[500px] bg-mountain-14 z-14",
        "mountain-15": "top-[27700px] w-[500px] h-[500px] bg-mountain-15 z-15",
        "mountain-16": "top-[29500px] w-[500px] h-[500px] bg-mountain-16 z-16",
        "mountain-17": "top-[31300px] w-[500px] h-[500px] bg-mountain-17 z-17",
        "mountain-18": "top-[33100px] w-[500px] h-[500px] bg-mountain-18 z-18",
        "mountain-19": "top-[34900px] w-[500px] h-[500px] bg-mountain-19 z-19",
        "mountain-20": "top-[36700px] w-[500px] h-[500px] bg-mountain-20 z-20",
        "mountain-21": "top-[38500px] w-[500px] h-[500px] bg-mountain-21 z-21",
        "mountain-22": "top-[40300px] w-[500px] h-[500px] bg-mountain-22 z-22",
        "mountain-23": "top-[42100px] w-[500px] h-[500px] bg-mountain-23 z-23",
        "mountain-24": "top-[43900px] w-[500px] h-[500px] bg-mountain-24 z-24",
        "mountain-25": "top-[45700px] w-[500px] h-[500px] bg-mountain-25 z-25",
    }

    return (
        <div
            ref={mountain}
            className={`flex inset-x-0 mx-auto absolute bg-cover
                        pointer-events-none bg-no-repeat bg-center
                        ${mountainVariants[id]}
                        `}
        >
            <DataContainer
                id={id}
                name={name}
                altitude={altitude}
                location={location}
                prominence={prominence}
                range={range}
                firstAscent={firstAscent}
                difficulty={difficulty}
            />
        </div>
    )
}
