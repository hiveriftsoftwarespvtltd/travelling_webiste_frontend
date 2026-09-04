import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const ElementSection = ({ className }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const initSimulation = () => {
            const Engine = Matter.Engine,
                Render = Matter.Render,
                World = Matter.World,
                Bodies = Matter.Bodies,
                Mouse = Matter.Mouse,
                MouseConstraint = Matter.MouseConstraint,
                Runner = Matter.Runner;

            const engine = Engine.create();
            const world = engine.world;
            const width = container.clientWidth;
            const height = container.clientHeight;

            const render = Render.create({
                element: container,
                engine: engine,
                options: {
                    width: width,
                    height: height,
                    pixelRatio: 2,
                    background: "transparent",
                    wireframes: false,
                },
            });

            const runner = Runner.create();
            Runner.run(runner, engine);

            // Static boundaries
            const ground = Bodies.rectangle(width / 2, height + 80, width + 320, 160, { isStatic: true });
            const leftWall = Bodies.rectangle(-80, height / 2, 160, height, { isStatic: true });
            const rightWall = Bodies.rectangle(width + 80, height / 2, 160, height, { isStatic: true });
            const ceiling = Bodies.rectangle(width / 2, -80, width + 320, 160, { isStatic: true });

            // Creating elements initially stacked together
            const tags = [];
            const centerX = width / 2;
            const centerY = height / 2 - 100; // Start slightly above center

            for (let i = 1; i <= 19; i++) {
                let texturePath = `/assets/img/shape/elements_1_${i}.svg`;

                let tag = Bodies.rectangle(centerX, centerY, 80, 80, {
                    chamfer: { radius: 10 },
                    restitution: 0.9, // Bouncy effect
                    render: {
                        sprite: {
                            texture: texturePath,
                            xScale: 1,
                            yScale: 1,
                        },
                    },
                });

                tags.push(tag);
            }

            World.add(world, [ground, leftWall, rightWall, ceiling, ...tags]);

            // Mouse control
            const mouse = Mouse.create(render.canvas);
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: { stiffness: 0.2, render: { visible: false } },
            });
            World.add(world, mouseConstraint);
            render.mouse = mouse;

            // **Adding Animation to Spread Out Elements**
            setTimeout(() => {
                tags.forEach((tag, index) => {
                    const forceX = (Math.random() - 0.5) * 0.05; // Random push left/right
                    const forceY = -0.05 - Math.random() * 0.02; // Upward push
                    Matter.Body.applyForce(tag, { x: tag.position.x, y: tag.position.y }, { x: forceX, y: forceY });
                });
            }, 1000); // Delay before spreading (1s)

            Render.run(render);

            // Cleanup on unmount
            return () => {
                Render.stop(render);
                World.clear(world);
                Engine.clear(engine);
                Runner.stop(runner);
                container.innerHTML = "";
            };
        };

        // Intersection Observer (Lazy load when visible)
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    initSimulation();
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(container);
    }, []);

    return (
        <section className={`elements-sec ${className}`}>
            <div className="container-fluid border-0 p-0">
                <div className="tags-container relative border-0" ref={containerRef}></div>
            </div>
        </section>
    );
};

export default ElementSection;
