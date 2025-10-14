export function Card() {
    return (
        <>
            <div className="lg:flex top-0 left-0 self-center justify-center gap-1 m-20 p-20">
                <div className="flex flex-col text-left p-10 bg-orange-400">
                    <h1 className="text-4xl font-normal text-white/90 p-2 mb-5">SEDANS</h1>
                    <p className="font-thin pr-15 mb-20 text-white/70">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero atque ab, natus veniam quidem facere ullam. Esse quasi enim quia </p>
                    <button className="flex border-none py-2 inline-block bg-white/90 rounded-full font-semibold hover:bg-black hover:text-white transition shadow-[var(--shadow-box)]">Learn More</button>
                </div>

                <div className="flex flex-col text-left p-10 bg-teal-600">
                    <h1 className="text-4xl font-normal text-white/90 p-2 mb-5">SUV</h1>
                    <p className="font-thin pr-15 mb-20 text-white/70">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero atque ab, natus veniam quidem facere ullam. Esse quasi enim quia </p>
                    <button className="flex border-none py-2 inline-block bg-white/90 rounded-full font-semibold hover:bg-black hover:text-white transition shadow-[var(--shadow-box)]">Learn More</button>
                </div>

                <div className="flex flex-col text-left p-10 bg-teal-900">
                    <h1 className="text-4xl font-normal text-white/90 p-2 mb-5">LUXURY</h1>
                    <p className="font-thin pr-15 mb-20 text-white/70">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero atque ab, natus veniam quidem facere ullam. Esse quasi enim quia </p>
                    <button className="flex border-none py-2 inline-block bg-white/90 rounded-full font-semibold hover:bg-black hover:text-white transition shadow-[var(--shadow-box)]">Learn More</button>
                </div>
            </div>
        </>
    );
}

