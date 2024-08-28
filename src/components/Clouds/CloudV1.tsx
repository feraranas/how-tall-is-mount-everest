import './styles.css'
import { useEffect, useRef } from "react";

const CloudV1 = () => {
    const cloud = useRef<HTMLDivElement | null>(null)

    function rn(from: number, to: number) {
        return ~~(Math.random() * (to - from + 1)) + from;
    }

    function rs(...args: string[]) {
      return args[rn(1, args.length) - 1];
    }

    function boxShadows(max: number) {
      const ret: string[] = [];
      for (let i = 0; i < max; ++i) {
        ret.push(`
          ${ rn(1, 100) }vw ${ rn(1, 100) }vh ${ rn(20, 40) }vmin ${ rn(1, 20) }vmin
          ${ rs('#11ccd7', '#c6f1e7', '#f0fff3', '#fa4659') }
        `)
      }

      return ret.join(',');
    }

    function update() {
        if (cloud.current) {
            cloud.current.style.boxShadow = boxShadows(100);
        }
    }
    
    useEffect(() => {
        update()
        document.addEventListener('click', update); 
        return () => {
            document.removeEventListener('click', update)
        }
    }, [])

  return (
    <>
        <div ref={cloud} className="overflow-hidden w-[1px] h-[1px] transform
                                    -translate-y-full -translate-x-full rounded-[50%]
                                    filter-url
                                    ">
        </div>
        <svg width="0">
            <filter id="filter">
                <feTurbulence type="fractalNoise"
                baseFrequency=".01" numOctaves="10" />
                <feDisplacementMap
                in="SourceGraphic" scale="240" />
            </filter>
        </svg>
    </>
  )
}

export default CloudV1