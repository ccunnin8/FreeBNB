import React from "react";

const Carousel = ({title, cards}) => {
    return (
        <div className="mx-auto px-9 min-w-full min-h-full">
            <h1 className="ml-3 text-3xl">{title}</h1>
            <div className="mx-auto w-4/5 flex flex-row flex-no-wrap scrolling-touch overflow-scroll">
                { cards.map((card, index) => (
                    <div key={index} 
                    className="w-11/12 flex-grow-0 flex-shrink-0 flex flex-col items-center h-58 px-5 py-2 mt-5 mx-2 border rounded shadow">
                        <img className="w-64 h-32" alt={`img of ${card.title}`} src={card.img} />
                        <h2 className="font-semibold capitalize mt-5">{card.title}</h2>
                        <h3 className="capitalize text-xs">{card.subtitle}</h3>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Carousel;