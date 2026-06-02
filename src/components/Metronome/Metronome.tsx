import { useEffect, useRef } from 'react'
import { PAGE_HEIGHT, MAP_HEIGHT, SUMMIT_OFFSET } from '../../config/scene';

const SCROLL_EDGE_BOTTOM = 100;
const SCROLL_EDGE_TOP = 350;

function Metronome() {
    const wrapper = useRef<HTMLDivElement | null>(null);
    const text = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const windowHeight = window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight - windowHeight;
        let rafPending = false;

        function updateMetronomo() {
            if (rafPending) return;
            rafPending = true;
            requestAnimationFrame(() => {
                rafPending = false;
                const scrollPosition = window.scrollY;

                const normalizedHeight = Math.abs(
                    (scrollPosition / pageHeight) * MAP_HEIGHT - MAP_HEIGHT
                );

                if (scrollPosition > PAGE_HEIGHT - (windowHeight + SCROLL_EDGE_BOTTOM)) {
                    wrapper.current?.classList.remove("active");
                } else if (scrollPosition >= 0 && scrollPosition <= SCROLL_EDGE_TOP) {
                    wrapper.current?.classList.remove("active");
                } else {
                    if (!wrapper.current?.classList.contains('active')) {
                        wrapper.current?.classList.add('active');
                    }
                }

                let meters = (Math.round(normalizedHeight + SUMMIT_OFFSET).toString().padStart(5, "0"));
                if (isNaN(Number(meters))) {
                    meters = "00000";
                }

                if (text.current) {
                    text.current.textContent = `${meters}m`;
                }
            });
        }

        window.addEventListener('scroll', updateMetronomo);

        return () => {
            window.removeEventListener('scroll', updateMetronomo);
        };
    }, []);


    return (
        <div
            ref={wrapper}
            className="fixed mx-auto inset-x-0 top-0 w-[280px] h-[70px] z-[99]
                        text-black items-center justify-center bg-slate-400
                        rounded-t-[0px] rounded-b-[15px] border border-t-0 border-black
                        ">
        <div
            ref={text}
            className="absolute top-0 text-black text-wrap w-full h-full
                        font-light grid content-center font-mono
                        text-[2.5rem] text-right pl-[22px] tracking-[30px]
                        ">
        </div>
        </div>
    )
}


export default Metronome
