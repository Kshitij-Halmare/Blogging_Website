import React, { useEffect, useRef, useState } from 'react';

function InPageNavigation({ routes, defaultHidden = [], defaultActiveTab = 0, children }) {
    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveTab);
    const ActiveTabLineRef = useRef();
    const ActiveTabref = useRef();

    const changeState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;
        ActiveTabLineRef.current.style.width = offsetWidth + "px";
        ActiveTabLineRef.current.style.left = offsetLeft + "px";
        setInPageNavIndex(i);
    }

    useEffect(() => {
        changeState(ActiveTabref.current, defaultActiveTab);
    }, []);

    return (
        <>
            <div className='relative mb-8 border-b border-gray-100 flex flex-nowrap overflow-x-auto'>
                {
                    routes.map((route, i) => {
                        // Ensure the route matches what's in defaultHidden
                        const isHidden = defaultHidden.includes(route);

                        return (
                            <button
                                key={i}
                                ref={i == defaultActiveTab ? ActiveTabref : null}
                                onClick={(e) => { changeState(e.target, i) }}
                                className={`p-4 px-5 capitalize ${inPageNavIndex === i ? 'text-black' : 'text-slate-600'} ${isHidden ? 'md:hidden lg:hidden' : ''}`}>
                                {route}
                            </button>
                        )
                    })
                }
                <hr ref={ActiveTabLineRef} className='absolute bottom-0 duration-300' />
            </div>
            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </>
    )
}

export default InPageNavigation;
