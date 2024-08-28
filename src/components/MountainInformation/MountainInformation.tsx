interface info {
    location: string;
    prominence: number;
    range: string;
    firstAscent: number;
    difficulty: string;
}

const MountainInformation: React.FC<info> = ({
    location,
    prominence,
    range,
    firstAscent,
    difficulty,
}) => {
  return (
    <div className="grid grid-rows-1 bottom-0 relative left-1/2
                    transform -translate-x-1/2 bg-transparent
                    border-t-[5px] text-start font-mono items-center
                    text-lg
                    ">
        <div className="absolute bottom-[5px] w-[13px] h-[13px]
                        justify-center bg-neutral-500 transform
                        translate-y-1/2 rotate-45
                        ">
        </div>
        
        <i className="text-sm h-[18px] w-[20px] bottom-[3px] text-white
                      pt-[5px] bg-slate-800 absolute left-1/2 transform
                      -translate-x-1/2 text-center rounded-none"
            data-mountain-key="9"></i>
        
        <div className="relative -bottom-[19px] p-2 bg-white left-1/2 transform
                        w-[250px] text-lg transition-opacity ease-linear opacity-5"
             data-key="9">
                
          <ul>
            <li>Location: {location}</li>
            <li>Prominence: {prominence}</li>
            <li>Mountain Ranges: {range}</li>
            <li>First Ascent: {firstAscent}</li>
            <li>Difficulty: {difficulty}</li>
          </ul>

          <div className="absolute bottom-0 w-screen h-[18.5px] bg-slate-400"></div>
        </div>
    </div>
  )
}

export default MountainInformation