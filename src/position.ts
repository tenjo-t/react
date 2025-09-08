import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * A React hook that returns the position of a DOM element.
 * The position is updated when the element is scrolled.
 *
 * @example
 * ```tsx
 * const [ref, position] = usePosition<HTMLDivElement>();
 *
 * return (
 *   <div ref={ref}>
 *     {position && <p>Position: {position.x}, {position.y}</p>}
 *   </div>
 * );
 * ```
 *
 * @returns A tuple containing:
 * - A `RefObject` to be attached to the element.
 * - The `DOMRect` of the element, or `null` if not available.
 */
export function usePosition<T extends Element>(): [
	RefObject<T | null>,
	DOMRect | undefined,
] {
	const ref = useRef<T>(null); // 対象要素
	const [position, setPosition] = useState<DOMRect | undefined>();

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		function updatePosition() {
			const rect = el?.getBoundingClientRect();
			if (rect) {
				setPosition(rect);
			} else {
				setPosition(undefined);
			}
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						window.addEventListener("scroll", updatePosition);
						updatePosition();
					} else {
						window.removeEventListener("scroll", updatePosition);
					}
				});
			},
			{ threshold: 0 },
		);
		observer.observe(el);

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", updatePosition);
		};
	}, []);

	return [ref, position];
}
