import MountainTitle from "../MountainTitle/MountainTitle";
import MountainInformation from "../MountainInformation/MountainInformation";
import { mountainConfig } from "../Mountains/Mountains";


const DataContainer: React.FC<mountainConfig> = ({
    name,
    altitude,
    location,
    prominence,
    range,
    firstAscent,
    difficulty,
}) => {
    return (
        <div
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
    )
}

export default DataContainer
