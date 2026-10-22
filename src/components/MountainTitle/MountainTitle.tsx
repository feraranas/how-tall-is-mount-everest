interface mountainTitle {
    name: string;
    altitude: number | null;
}

const MountainTitle: React.FC<mountainTitle> = ({
    name,
    altitude
}) => {
  return (
    <div className="grid absolute top-0 grid-row-2 justify-center
                    w-screen h-3/4 font-mono bg-transparent pt-[10px] pb-[10px]

                    ">
                        
        <div className="border border-b-[3px] border-dashed border-r-2
                        text-center grid items-center w-screen
                        ">
            {name}
        </div>

        <div className="grid justify-center text-center items-center
                        w-screen
                        ">
            {altitude ?? "unknown"}
        </div>
    </div>
  )
}

export default MountainTitle