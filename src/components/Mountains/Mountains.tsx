import { Mountain } from './Mountain';
import { mountains } from './mountainsInfo';
import { SUMMIT_OFFSET, MOUNTAIN_SPACING } from '../../config/scene';

export interface MountainConfig {
    asset: string;
    src: string;
    name: string;
    altitude: number;
    location: string;
    prominence: number;
    range: string;
    firstAscent: number;
    difficulty: string;
}

const Mountains = () => {
  return (
    <div aria-hidden className="absolute top-0 left-0 w-full h-full pointer-events-none select-none">
      {mountains.map((mountain, index) => (
        <Mountain
          key={mountain.asset}
          src={mountain.src}
          top={SUMMIT_OFFSET + index * MOUNTAIN_SPACING}
          zIndex={index + 1}
          name={mountain.name}
          altitude={mountain.altitude}
          location={mountain.location}
          prominence={mountain.prominence}
          range={mountain.range}
          firstAscent={mountain.firstAscent}
          difficulty={mountain.difficulty}
        />
      ))}
    </div>
  );
};

export default Mountains;
