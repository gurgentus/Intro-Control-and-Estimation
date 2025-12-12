# First Controller

Let's take a simplified version of our car model. The dynamic and output equations are

$$
\dot{s} = v,
$$

$$
\dot{v} = u/m_0,
$$

$$
y = s.
$$

Here we chose to have the total traveled distance, $s$, as the output instead of velocity. Thinking ahead this would be useful for more complex tasks than just standard cruise control, for example this could represent deviation from a known trajectory (e.g. distance behind the car in front). Here the mass $m_0$ is constant and the control $u$ represents the total thrust. Written in matrix form this corresponds to

$$
\dot{x} = F x + G u,
$$

where

$$
x =
\begin{bmatrix}
s \\
v
\end{bmatrix},
\quad
F =
\begin{bmatrix}
0 & 1 \\
0 & 0
\end{bmatrix},
\quad
G =
\begin{bmatrix}
0 \\
1/m_0
\end{bmatrix}.
$$

Verify that the more general model from the homework simplifies to this case when the control variable is the thrust, steering control $\delta w = 0$ and the mass is constant.

Let's write down the open loop transfer for this case. Recall that

$$
T_o(s) = H (sI - F)^{-1} G =
\begin{bmatrix}
1 & 0
\end{bmatrix}
\begin{bmatrix}
s & -1 \\
0 & s
\end{bmatrix}^{-1}
\begin{bmatrix}
0 \\
1/m_0
\end{bmatrix}
= \frac{1}{s^2}
\begin{bmatrix}
1 & 0
\end{bmatrix}
\begin{bmatrix}
s & 1 \\
0 & s
\end{bmatrix}
\begin{bmatrix}
0 \\
1/m_0
\end{bmatrix}
=
\frac{1}{m_0 s^2} = N(s)/D(s),
$$

where $N(s) = 1/m_0$ and $D(s) = s^2$ in terms of the notation in the previous lecture.

For example if our control is $u = 4$ m/s, with the corresponding Laplace transform $U(s) = 4/s$, then

$$
Y(s) = T_0(s) U(s) = \frac{4}{m_0 s^3}.
$$

Assuming zero initial conditions and taking the inverse Laplace Transform gives

$$
y(t) = s(t) = \frac{2}{m_0} t^2.
$$

We could have of course simply integrated the original equation $\ddot{s} = u/m_0$ twice to obtain the same result. Before writing down a control system for this model we note that the open-loop control has one undesirable characteristic, lack of asymptotic stability. For a constant coefficient linear system this is characterized by not all of the poles of the transfer function having negative real parts (in the above case there is a pole at $s=0$ of multiplicity 2). For precise mathematical definitions of asymptotic stability refer to [ODE Notes](http://gurgentus.name/work/wp-content/uploads/2017/02/Notes1130.pdf), or any dynamical systems textbook. Intuitively asymptotic stability of a critical point means that without the nonhomogeneous forcing term ($u$ in our case) the solution will converge to the critical point ($[0, 0]$ in our case). For linear constant coefficient systems this is simply the consequence of the solution having the form

$$
x(t) = e^{F(t - t_0)} x_0 + \int_{t_0}^{t} e^{F(t-s)} G(s) u(s) ds
$$

where one can show from the definition of the matrix exponential that for any $\epsilon > 0$, there exists a positive constant $M$ such that

$$
|e^{Ft} \zeta| \le M e^{(b + \epsilon) t} |\zeta|,
$$

for all $\zeta \in \mathbb{R}^n$, $t \ge 0$, where $b = \max_{1 \le i \le n} \{ Re(\lambda_i)\}$ and $\lambda_i$ are the eigenvalues of $F$. Stated more simply the operator norm of the matrix exponential satisfies

$$
||e^{Ft}|| \le M e^{(b + \epsilon) t}.
$$

Hence if all eigenvalues are negative and we have appropriate bounds on the control we can always find an $\epsilon$ to show that the norm of $x(t)$ converges to $0$ as $t \rightarrow \infty$.

The lack of asymptotic stability has an unfortunate consequence that even a minuscule initial velocity or a very short duration application of the control could have the effect of taking us very far from the starting position as time moves forward (or from a nominal trajectory, like following a car). You can independently verify this for our example by solving the original equation with nonzero initial conditions and/or the nonhomogeneous term $u$ in a piecewise defined form

$$
u =
\begin{cases}
u_0 & \mbox{ if } 0 \le t \le t_0, \\
0 & \mbox{ if } t > t_0.
\end{cases}
$$

Of course we did not include friction in the simplified model. The addition of a damping term would have a positive effect of making even the open-loop control stable. In either case, the benefit of adding a closed loop control is that it can potentially stabilize an unstable system or improve stability characteristics of a stable one (note that the convergence in the exponential bound above will improve the more negative we make the real parts of the eigenvalues).

Let's return the the transfer function

$$
T_o(s) = \frac{N(s)}{D(s)} = \frac{1/m_0}{s^2}
$$

and come up with a tracking controller with a slightly more general form

$$
u(t) = k_p e(t) + k_i \int_0^t e(t) dt + k_d e'(t),
$$

where $e(t) = y_d(t) - y(t)$ is the tracking error (see Week 4 Lecture 1). This is called a PID (Proportional, Integral, Derivative) controller. Note the addition of two constants $k_i$ and $k_d$. Mathematically this will give more parameters in the resulting closed-loop transfer function to improve stability. Intuitively the control takes into account not just the current error, but how fast it is changing and the time integral of the error. The last term can be important for example if the error is small and is decreasing, but not decreasing fast enough (think of the integral of $1/t$ vs $1/t^2$ as $t \rightarrow \infty$). In the frequency domain

$$
U(s) = C(s) E(s) = (k_p + k_i/s + k_d s) E(s) = \frac{k_p s + k_i + k_d s^2}{s} E(s)
$$

and as before we may calculate

$$
Y(s) = T_o(s) U(s) = C(s) T_o(s) (Y_d(s) - Y(s))
$$

and solving for $Y(s)$,

$$
Y(s) = \frac{C(s) T_o(s)}{1 + C(s) T_o(s)} Y_d(s).
$$

So in general the closed-loop transfer function is

$$
T_c(s) = \frac{C(s) T_o(s)}{1 + C(s) T_o(s)} = \frac{C(s) N(s)}{D(s) + C(s) N(s)}.
$$

For the PID control the transfer function becomes

$$
T_c(s) = \frac{(k_p s + k_i + k_d s^2) T_o(s)}{s + (k_p s + k_i + k_d s^2) T_o(s)}
= \frac{(k_p s + k_i + k_d s^2) N(s)}{s D(s) + (k_p s + k_i + k_d s^2) N(s)}
$$

We note several facts. In the limit as $k_p$, $k_d$, and $k_i$ approach $0$ the nonzero poles of $T_c$ converge to the poles of $T_o$. In the limit as $k_p, k_d, k_i$ approach $\pm \infty$, $m$ of the poles of $T_c$ converge the $m$ zeros of $T_o$, with $T_c$ potentially having more poles (counting according to multiplicity), which have to go to infinity.

For our 1D car example

$$
T_c(s) = \frac{k_p s + k_i + k_d s^2}{m_0 s^3 + k_p s + k_i + k_d s^2}.
$$

We end with a particularly useful feature of the integral control (i.e. $k_i \ne 0$). Not only does this term ensure that there are no poles at the origin, but in general it is the property of Laplace Transforms that the steady-state error $\lim_{t\rightarrow \infty} (y_d(t) - y(t))$ is given by

$$
e_{ss} = \lim_{s \rightarrow 0} s (Y_d(s) - Y(s)) = \lim_{s \rightarrow 0}{ s (1 - T_c(s)) Y_d(s)}.
$$

In particular if $Y_d(s) = c/s$ as is the case for the step input it is enough to have $T_c \rightarrow 1$ as $s \rightarrow 0$ to ensure zero steady-state error. This is guaranteed for the PID control if $k_i \ne 0$. The idea is to tune $k_p, k_i$, and $k_d$ to 'place' the poles of the transfer function at the desired location. The difficulty is of course that we now have three parameters instead of one.

<div class="bordered">

Let's do the following exercise. To simplify the situation let $k_d = 0$ and $k_p = 1$ and write the transfer function as

$$
T_c(s) = \frac{s + k_i}{m_0 s^3 + s + k_i}.
$$

- Use the cubic formula to write down expressions for the three roots of the denominator in terms of $k_i$. Use MATLAB or other plotting program/library to plot the root locus (do not use the MATLAB root locus functions).
- Consider the full car model with steering. Let $x_l(t) = [x_l(t), y_l(t)]^T$ be a given vector function of $t$ that describes a trajectory of a different car, which we'll call the lead car. Let the horizontal position $x(t)$ be the output of our model. Assume we want to follow this car at a horizontal distance of $10$m. In other words we want the tracking error $e(t) = x(t) - (x_l(t)-10)$ to be small. Derive the closed-loop PID tracking control transfer function for our car model with fixed steering angle, the total thrust $T$ as the control and the $x$ location as the output. Note: We'll assume a different mechanism is responsible for the steering (for example some machine learning based object detection algorithms) and the steering is slow enough that we can take it to be constant for the purposes of our control.

</div>

You can check your work using the interactive Cloud Control Toolbox:

<iframe src="https://ccst-phi.vercel.app/" width="100%" height="800" frameborder="0" style="border: 1px solid #ddd; border-radius: 4px;" allowfullscreen></iframe>

<p style="margin-top: 1rem;">
<a href="https://ccst-phi.vercel.app/" target="_blank" class="md-button md-button--primary">Open in New Tab</a>
</p>
