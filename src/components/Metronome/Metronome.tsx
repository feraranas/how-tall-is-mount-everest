import { useEffect, useRef } from 'react'

function Metronome() {
    const totalHeight = 50000;
    const mapHeight = 6800;

    const wrapper = useRef<HTMLDivElement | null>(null);
    const text = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const windowHeight = window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight - windowHeight;

        function updateMetronomo() {
            const scrollPosition = window.scrollY;
            
            const normalizedHeight = Math.abs(
                (scrollPosition / pageHeight) * 6800 - mapHeight
            )
            
            if (scrollPosition > totalHeight - (windowHeight + 100)) {
                wrapper.current?.classList.remove("active");
            }
            else if (scrollPosition >= 0 && scrollPosition <= 350) {
                wrapper.current?.classList.remove("active");
            }
            else {
                if (!wrapper.current?.classList.contains('active')) {
                    wrapper.current?.classList.add('active')
                }
            }
            
            let meters = (Math.round(normalizedHeight + 2500).toString().padStart(5, "0"));
            if (isNaN(Number(meters))) {
                meters = "00000";
            }
            
            if (text.current) {
                text.current.textContent = `${meters}m`;
            }
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
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
        </div>
        </div>
    )
}


export default Metronome


// left-[50%] sm:w-1/4 md:w-2/4
// transform -translate-x-[50%] translate-y-[0px]