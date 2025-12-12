# Frequency Domain Analysis

<p class="math-connection"><em>Mathematical connections: differential equations, Laplace transform.</em></p>

This week we concentrate on systems of differential equations of the form

\begin{equation}
\dot{x}(t) = F(t) x(t) + G(t) u(t) + L(t) w(t),
\label{eq:dyneq}
\end{equation}

where $u$ represents controllable inputs and $w$ represents uncontrollable inputs (disturbances).

As we saw last week, such linear systems usually arise by the process of linearization, where the corresponding state, input, and disturbance vectors are written as perturbations from some 'simple' state, input, and disturbance values:

$$
x_0 + x(t), u_0 + u(t), \mbox{ and } w_0 + w(t).
$$

We will come back to the idea of linearization in later weeks, so for now there is no danger in assuming that \eqref{eq:dyneq} describes our model precisely.

Our goal is to study the dynamics in the form of an abstract first order linear differential equation

\begin{equation}
\label{eq:abssys}
\dot{x}(t) = A(t) x(t) + e(t),
\end{equation}

where the equation is homogeneous if $e \equiv 0$.

## Types of Control

We may study various types of controls:

### Open-Loop Control

In an open-loop control $u(t)$ is a predetermined function and so the system can be written as

$$
\dot{x} = A(t) x + e(t),
$$

where $A(t) = F(t)$ and $e(t) = G(t) u(t) + L(t) w(t)$. Even without disturbances the equation is nonhomogeneous.

### Closed-Loop Feedback Control

Systems with closed-loop feedback control may assume the control can be written as:

$$
u(t) = -C(t) x(t),
$$

and so our system can be written as:

$$
\dot{x} = A(t) x + e(t),
$$

where $A(t) := F(t) - G(t) C(t)$ and $e(t) := L(t) w(t)$. Note if there are no disturbances we get a homogeneous system.

Intuitively think about designing control actions for flying an airplane, it would probably produce a more 'stable' situation if your control somehow reacts to the state of the airplane, as opposed to predetermining all of the controls on the ground before taking off (even if you calculated that those controls should be optimal, small unpredictable disturbances sure to occur in the air could make those controls useless).

### Dynamic Compensation

In addition one could add dynamic compensation to the control feedback law:

$$
u(t) = -C_1(t) x(t) - C_2(t) \int_0^t H_\xi x(\tau) d \tau,
$$

i.e. the control $u$ depends not just on the current state, but on the contribution from all previous states. Here $H_\xi$ is an identity matrix with some of the rows removed (if the corresponding element of the state should not have an effect).

Can we still put this into the framework of \eqref{eq:abssys}? Let's define $\xi(t)$ to be the solution of

$$
\dot{\xi}(t) = H_\xi x(t), \quad \xi(0) = 0.
$$

Then by the Fundamental Theorem of Calculus

$$
u(t) = -C_1(t) x(t) - C_2(t) \xi(t)
$$

and the dynamics can be described by

$$
\begin{bmatrix}
\dot{x}(t) \\
\dot{\xi}(t)
\end{bmatrix}
=
\begin{bmatrix}
F(t) - G(t) C_1(t) & -G(t) C_2(t) \\
H_\xi & 0
\end{bmatrix}
\begin{bmatrix}
x(t) \\
\xi(t)
\end{bmatrix}
+
\begin{bmatrix}
L(t) w(t) \\
0
\end{bmatrix},
$$

which redefining $x$ to be the above vector can again be written in the form

$$
\dot{x} = A(t) x + e(t).
$$

Again without disturbances $w$ the system is homogeneous.

### Actuator Dynamics

Finally, the choice of control could involve solving a differential equations on its own. Such actuator dynamics can take the form

$$
\dot{u}(t) = F_C(t) u(t),
$$

for a given $F_C(t)$. Here we can again write the equation in the general form (RS 2.5-19)

$$
\begin{bmatrix}
\dot{x}(t) \\
\dot{u}(t)
\end{bmatrix}
=
\begin{bmatrix}
F(t) & G(t) \\
0 & F_C(t)
\end{bmatrix}
\begin{bmatrix}
x(t) \\
u(t)
\end{bmatrix}
+
\begin{bmatrix}
L(t) w(t) \\
0
\end{bmatrix}
$$

## Laplace Transform and Frequency Domain Methods

Hopefully at this point you are convinced that there are various way to design our controls and a pressing question is how these choices can be designed to drive the state of our model to the behavior we want. One complication of this analysis is the fact that the relations between the control and the state are through differential equations. As we will see in the remainder of this week, the Laplace Transform which you doubtless encountered in an elementary differential equations course is extremely helpful in this context. Below I describe the 'Frequency Domain Methods' that utilize this marvelous invention of Pierre-Simon Laplace.

We'll come back to the feedback controls soon enough, but for now let's return to \eqref{eq:dyneq} as is and assume in addition that the matrices $F$ and $G$ do not depend on $t$ and there is no uncontrollable input. Recall that the Laplace Transform of the resulting equation

$$
\dot{x}(t) = F x(t) + G u(t)
$$

is given by

$$
s X(s) = F X(s) + G U(s) + x(0).
$$

We also assume that we have an output vector

$$
y(t) = H x(t),
$$

with the corresponding equation in the 'frequency domain':

\begin{equation}
\label{eq:siso}
Y(s) = H X(s).
\end{equation}

If you have only seen Laplace Transforms applied to scalar equations you should convince yourself that the formulas above still make sense in the vector setting, after all you are simply taking the Laplace Transform of all equations in your system.

## Transfer Functions

Assuming $x(0) = 0$ and using a little linear algebra magic we can write the input-output relation in the frequency domain as

$$
(sI - F) X(s) = G U(s),
$$

or

$$
X(s) = (sI - F)^{-1} G U(s).
$$

Similarly,

$$
Y(s) = H X(s) = [H (sI - F)^{-1} G] U(s).
$$

In the frequency domain the relation between the control and the state or the output is simply represented by a multiplication by an $s$-dependent matrix, an ugly matrix, $H (sI - F)^{-1} G$ but still just a matrix. We will call it the transfer function.

Finally, we make one more assumption destroying large part of our generalization only to be recovered later in the semester. That is we assume that the control $u(t)$ is a single scalar and so is the output $y(t)$. In other words the ugly matrix $H (sI - F)^{-1} G$ relating the corresponding Laplace Transforms is nothing other than a scalar. Don't relax too much though $H$, $I$, $F$, and $G$ are still matrices (or at best vectors), as I never said that the state $x(t)$ is a scalar, that would make things really too simple and not as interesting. So $x$ is still an n-dimensional vector and the dynamics equation is still a system, all we are saying is that it is controlled by one input and produces one output. You should check that it then makes sense that $G$ is $n \times 1$, $F$ is $n \times n$ and $H$ to be $1 \times n$.

## Exercise: Applying to the Car Model

<div class="bordered">

Time to get your hands dirty. Take the linearization of the simple car model from last week. We'll need to get rid of some of the controls to fit it into our assumptions. I will suggest assuming a constant thrust $T = T_0$ and leaving the steering to be our only control $u = \delta w$. We will also have to introduce the output equation $y(t) = H x(t)$ for this model. Our state $x$ consisted of things like velocity, orientation, the position coordinates, and mass. Let's take the orientation $\xi$ as our output. Can you see what $H$ would have to be to provide this information to $y$ on the proverbial golden plate? How about $H = [0, 1, 0, 0, 0]$ since the orientation $\xi$ appeared as the second component of $x$?

At this point you should be able to turn in an assignment with a nonlinear system of differential equations describing the simple car model, the linearized version done last week (written in the abstract form of \eqref{eq:dyneq} and \eqref{eq:siso}, with the expressions for $F$, $G$,and $H$ given separately, and an expression in the form:

$$
Y(s) = T(s) U(s)
$$

relating the single input to single output in the frequency domain. Again, leave this expression in the form above, just add what $T(s)$ is separately.

</div>
