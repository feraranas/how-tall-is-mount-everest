
import { Mountain } from './Mountain'
import { mountains } from './mountainsInfo';

type MountainID = 'mountain-1' | 'mountain-2' | 'mountain-3' | 'mountain-4' | 'mountain-5' |
                  'mountain-6' | 'mountain-7' | 'mountain-8' | 'mountain-9' | 'mountain-10' | 
                  'mountain-11' | 'mountain-12' | 'mountain-13' | 'mountain-14' | 'mountain-15' | 
                  'mountain-16' | 'mountain-17' | 'mountain-18' | 'mountain-19' | 'mountain-20' | 
                  'mountain-21' | 'mountain-22' | 'mountain-23' | 'mountain-24' | 'mountain-25';

export interface mountainConfig {
    id: MountainID;
    name: string;
    altitude: number;
    location: string;
    prominence: number
    range: string;
    firstAscent: number;
    difficulty: string;
}

const Mountains = () => {
  return (
    <>
    {mountains?.map((mountain) => (
        <Mountain key={mountain.id}
                  id={mountain.id}
                  name={mountain.name}
                  altitude={mountain.altitude}
                  location={mountain.location}
                  prominence={mountain.prominence}
                  range={mountain.range}
                  firstAscent={mountain.firstAscent}
                  difficulty={mountain.difficulty}
        />
    ))}
    </>
  )
}

export default Mountains