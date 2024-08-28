
import { useEffect, useRef } from 'react'

function Metronome() {
    const totalHeight = 50000;
    const mapHeight = 6800;

    const wrapper = useRef<HTMLDivElement | null>(null);
    const text = useRef<HTMLDivElement | null>(null);
    const metersText = useRef<HTMLDivElement | null>(null);

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
            
            if (metersText.current) {
                metersText.current.textContent = `${meters}m`;
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
                        text-black justify-center bg-slate-100
                        rounded-t-[0px] rounded-b-[15px] border border-t-0 border-black
                        shadow-sm
                        ">
            <div
                ref={text}
                className=" text-black w-full h-full
                           font-mono text-[1.5rem] tracking-[30px]
                          ">
                
                <div ref={metersText} className="flex h-full w-full absolute top-0
                                                 items-center justify-center pl-6
                                                 ">
                    Scroll up!
                </div>

                <div className="grid grid-cols-6 h-full w-full">
                    <div className="border-r-[1.2px] border-solid border-black"></div>
                    <div className="border-r-[1.2px] border-solid border-black"></div>
                    <div className="border-r-[1.2px] border-solid border-black"></div>
                    <div className="border-r-[1.2px] border-solid border-black"></div>
                    <div className="border-r-[1.2px] border-solid border-black"></div>
                    
                </div>
            </div>
        </div>
    )
}


export default Metronome


// left-[50%] sm:w-1/4 md:w-2/4
// transform -translate-x-[50%] translate-y-[0px]