

const LandingPage = () => {
  return (
    <>
        <div className={`flex inset-x-0 mx-auto absolute bg-cover top-[49512px]
                        pointer-events-none bg-no-repeat bg-center
                        w-[100%] h-[50%] bg-offroad border border-blue-400
                        border-r-4 border-t-4 border-b-8 border-l-4`
                        }>
        </div>
        <div className={`inset-x-0 mx-auto absolute bg-contain top-[49500px]
                        pointer-events-none bg-no-repeat bg-right
                        w-[100%] h-[400px] bg-rock border border-orange-400
                        border-r-4 border-t-4 border-b-8 border-l-4`
                        }>
        </div>
        <div className={`inset-x-0 mx-auto absolute bg-cover top-[49810px]
                        pointer-events-none bg-no-repeat bg-center
                        w-[100%] h-[20%] bg-floor border border-pink-400
                        border-r-4 border-t-4 border-b-8 border-l-4`
                        }>
        </div>
        <div className={`inset-x-0 mx-auto absolute bg-contain left-1/4 top-[49700px]
                        pointer-events-none bg-no-repeat bg-center border border-red-400
                        border-r-4 border-t-4 border-b-8 border-l-4
                        w-[30%] h-[30%] bg-men`
                        }>
        </div>
        <div className={`inset-x-0 mx-auto absolute bg-contain right-3/4 top-[49700px]
                        pointer-events-none bg-no-repeat bg-center
                        w-[30%] h-[30%] bg-women border border-red-400
                        border-r-4 border-t-4 border-b-8 border-l-4`
                        }>
        </div>
    </>
  )
}

export default LandingPage