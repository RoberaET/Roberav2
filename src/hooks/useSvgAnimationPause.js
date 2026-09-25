import { useEffect, useRef } from 'react';

export default function useSvgAnimationPause(options = { threshold: 0.05 }) {
    const svgRef = useRef(null);

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                try {
                    if (svgElement.unpauseAnimations) {
                        svgElement.unpauseAnimations();
                    }
                } catch (e) {
                    console.warn('SVG unpauseAnimations not supported', e);
                }
            } else {
                try {
                    if (svgElement.pauseAnimations) {
                        svgElement.pauseAnimations();
                    }
                } catch (e) {
                    console.warn('SVG pauseAnimations not supported', e);
                }
            }
        }, options);

        observer.observe(svgElement);

        return () => {
            observer.disconnect();
            try {
                if (svgElement.unpauseAnimations) {
                    svgElement.unpauseAnimations();
                }
            } catch (e) {}
        };
    }, [options.threshold]);

    return svgRef;
}
