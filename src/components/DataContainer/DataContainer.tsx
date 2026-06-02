import { useRef } from "react";
import MountainTitle from "../MountainTitle/MountainTitle";
import MountainInformation from "../MountainInformation/MountainInformation";

interface DataContainerProps {
    name: string;
    altitude: number;
    location: string;
    prominence: number;
    range: string;
    firstAscent: number;
    difficulty: string;
}

const DataContainer: React.FC<DataContainerProps> = ({
    name,
    altitude,
    location,
    prominence,
    range,
    firstAscent,
    difficulty,
}) => {
    const data = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={data}
            className="absolute grid grid-rows-[145px_75px]
                    w-screen h-[150px] text-black bg-slate-500
                    ">
                <MountainTitle name={name} altitude={altitude} />
                <MountainInformation location={location}
                                     prominence={prominence}
                                     range={range}
                                     firstAscent={firstAscent}
                                     difficulty={difficulty}
                />
        </div>
    );
};

export default DataContainer;
