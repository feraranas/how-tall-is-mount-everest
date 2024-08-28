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
    
    const mountainVariants = {
        "mountain-1": "top-[500px] bg-mountain-1 z-1",
        "mountain-2": "top-[12500px] bg-mountain-2 z-2",
        "mountain-3": "top-[15000px] bg-mountain-3 z-3",
        "mountain-4": "top-[20500px] bg-mountain-4 z-4",
        "mountain-5": "top-[22500px] bg-mountain-5 z-5",
        "mountain-6": "top-[25000px] bg-mountain-6 z-6",
        "mountain-7": "top-[30500px] bg-mountain-7 z-7",
        "mountain-8": "top-[32500px] bg-mountain-8 z-8",
        "mountain-9": "top-[35000px] bg-mountain-9 z-9",
        "mountain-10": "top-[37500px] bg-mountain-10 z-10",
        "mountain-11": "top-[40500px] bg-mountain-11 z-11",
        "mountain-12": "top-[42500px] bg-mountain-12 z-12",
        "mountain-13": "top-[47500px] bg-mountain-13 z-13",
        "mountain-14": "top-[10500px] bg-mountain-14 z-14",
        "mountain-15": "top-[10500px] bg-mountain-15 z-15",
        "mountain-16": "top-[10500px] bg-mountain-16 z-16",
        "mountain-17": "top-[10500px] bg-mountain-17 z-17",
        "mountain-18": "top-[10500px] bg-mountain-18 z-18",
        "mountain-19": "top-[10500px] bg-mountain-19 z-19",
        "mountain-20": "top-[10500px] bg-mountain-20 z-20",
        "mountain-21": "top-[10500px] bg-mountain-21 z-21",
        "mountain-22": "top-[10500px] bg-mountain-22 z-22",
        "mountain-23": "top-[10500px] bg-mountain-23 z-23",
        "mountain-24": "top-[10500px] bg-mountain-24 z-24",
        "mountain-25": "top-[10500px] bg-mountain-25 z-25",
    }

    return (
        <div
            ref={mountain}
            className={`flex inset-x-0 mx-auto absolute bg-cover
                        pointer-events-none bg-no-repeat bg-center
                        w-[100%] h-[100%] 
                        sm:w-[100%] sm:h-[120%] 
                        md:w-[100%] md:h-[155%] 
                        lg:w-[100%] lg:h-[190%] 
                        xl:w-[100%] xl:h-[250%] 
                        2xl:w-[100%] 2xl:h-[300%]
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
