# Introduction and 2D Car Model

Control theory deals with studying and modifying the behavior of dynamical systems with inputs and outputs. The actual system is usually referred to as *plant* and the system that decides on the input (possibly based on the observed output) is a *controller.* Our goal here is not to spend a lot of time on the full history or overview of this fascinating field that started with practical engineering problems and slowly gained its rigid mathematical structure, at the same time being pushed further and further by more and more complicated problems of engineering.

Our study of control theory will be largely mathematical with examples drawn principally from problems in *autonomous vehicle control* and *air/spacecraft control*. Of course, one of the main benefits of concentrating on the mathematics is that everything you learn can be ported to studying problems in unrelated fields ranging from biology to social sciences to economics.

With that let's delve straight into our first *plant.* Most of Module 1 will use a relatively simple model of a three degree of freedom car culminating with a project consisting of designing an adaptive cruise control for an autonomous vehicle. (Preview: In Module 2 we will introduce a model for landing a spacecraft on a planet while minimizing the acceleration, stay tuned...)

## The 2D Car Model

For now we remain on the ground, in fact assuming that this ground is completely flat, and describe the car with the following *state variables*: the position of its center of mass in the Cartesian coordinates, $x$, $y$, its angle of orientation, $\xi$, its velocity, $v$, and its mass, $m$. The inputs that can be controlled will be the amount of thrust applied, $\delta T$, the amount of breaking, $\delta B$, and the angle by which the front wheels are turned, $\delta w$. Below is a diagram summarizing this variables.

!!! note "TODO"
    ADD PICTURE

## Deriving the Dynamics

The next step is to derive a differential equation that describes the dynamics. We'll start easy. The velocity components in the $x$ and $y$ directions can be simply obtained as vector projections of $v$ onto the coordinate axis using trigonometry,

$$
\dot{x} = v \cos(\xi),
$$

$$
\dot{y} = v \sin(\xi).
$$

We'll also assume that the mass changes as a function of velocity and the throttle, i.e.

$$
\dot{m} = g(v, \delta T)
$$

This can be specified more explicitly depending on the properties of the actual car.

### Applying Newton's Second Law

Now for the more complicated pieces. As is often the case with these kinds of problems, our best friend is Newton's Second law, $F = m a = m \dot{v}$, written in terms of the velocity $v$. What are the different forces acting on the car? To keep things a bit general we will assume that the total thrust provided by the car is $T(v, \delta T, \delta B)$, a function of the current velocity, as well as throttle and break amount. We also assume that the component of $T$ perpendicular to the tire has an equal friction force in the opposite direction to cancel it, leaving the parallel component, $T \cos(\delta w)$ as the net force (see the picture for the force diagram). In turn, this force has components $T \cos(\delta w) \cos(\delta w)$ in the direction of forward acceleration, $\dot{v}$ and $T \cos(\delta w) \sin(\delta w)$ in the tangential direction. It follows that,

$$
m \dot{v} = T \cos^2 (\delta w) - D(v),
$$

where the last term is the drag due to air resistance, often approximated with, $C_D \rho v^2 S/2$, where $C_D$ is the drag coefficient, $\rho$ is the density of air, $S$ is the area of the surface. We'll keep this as $D(v)$ to keep things general.

### Angular Velocity

The effect of the tangential force $T \cos(\delta w) \sin(\delta w)$ is slightly more technical to derive using Newton's Law. To keep things relatively simple, we'll use a slightly different argument to obtain an expression for the angular velocity $\dot{\xi}$. Assume that in time $\Delta t$ the base of the car moved $v \Delta t$ in original direction, $\xi$, while the orientation $\xi$ changed by $\Delta \xi$ as shown in the zoomed in picture below

!!! note "TODO"
    ADD PICTURE

Then, using the law of sines from trigonometry yields

$$
\frac{l}{\sin(180-\delta w)} = \frac{l - v \Delta t}{\sin(\delta w - \Delta \xi)},
$$

or after simplification

\begin{equation}
\label{m2}
l \sin(\delta w - \Delta \xi) = l \sin(\delta w) - v \Delta t \sin(\delta w).
\end{equation}

Note that by the mean value theorem $\sin(\delta w) - \sin(\delta w - \Delta \xi) = \cos(\delta w_*) \Delta \xi$ for some value of $\delta w_*$ between $\delta w - \Delta \xi$ and $\delta w$. Substituting the expression for $\sin(\delta w - \Delta \xi)$ into \eqref{m2} results in,

$$
l \sin(\delta w) - l \Delta \xi \cos(\delta w_*) = l \sin(\delta w) - v \Delta t \sin(\delta w),
$$

or after simplification

$$
\frac{\Delta \xi}{\Delta t} = \frac{v}{l} \frac{\sin(\delta w)}{\cos(\delta w_*)}
$$

Finally, taking the limit as $\Delta t \rightarrow 0$ (and consequently $\delta w_* \rightarrow \delta w$), we have

$$
\frac{d \xi}{ dt} = \frac{v}{l} \tan(\delta w).
$$

## System Summary

<div class="bordered">

Let's summarize our derived system of differential equations below,

$$
\begin{array}{ccc}
\dot{v} & = & \frac{T(v, \delta T, \delta B) \cos^2 (\delta w) - D(v)}{m}, \\
\dot{\xi} & = & \frac{v}{l} \tan(\delta w), \\
\dot{x} & = & v \cos(\xi), \\
\dot{y} & = & v \sin(\xi), \\
\dot{m} & = & g(v, \delta T).
\end{array}
$$

</div>
