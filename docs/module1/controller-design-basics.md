# Controller Design Basics

<p class="math-connection"><em>Mathematical connections: differential equations, Laplace transform</em></p>

We are now ready to analyze our first closed-loop system. As we saw in the last lecture it can be very convenient to represent Input/Output relations using the transfer function approach. In this way we can reduce the dynamics to a relation

$$
Y(s) = T(s) U(s),
$$

between the Laplace Transforms of the control and the output. We will call $T(s)$ the plant transfer function. One of the simplest ways to construct a closed-loop feedback control is to take the difference between a given 'desired' output $y_d(t)$ and the actual output $y(t)$ and feed a constant multiple of this 'error' in output back as the control. For nonzero $y_d(t)$ this type of control is called 'tracking control'.

At this point we are still concerned with SISO (single input, single output) systems where the transfer function is a scalar, so you can easily verify that in the Laplace Transform world this corresponds to choosing $U(s) = k (Y_d(s) - Y(s))$ resulting in the new relation:

$$
Y(s) = k T(s) (Y_d(s) - Y(s))
$$

or solving for $Y(s)$:

$$
Y(s) = \frac{k T(s)}{1 + k T(s)} Y_d(s)
$$

We now have a new transfer function
\begin{equation}
\label{propcont}
T_c(s) = \frac{k T(s)}{1 + k T(s)}
\end{equation}
that gives us an input/output relation between the command signal (desired $y_d$) and the actual output.

You can imagine representing a more complicated relation between the tracking error $y_d(t) - y(t)$ and the control $u(t)$ (see for instance examples in the last lecture) by

$$
U(s) = K(s) (Y_d(s) - Y(s))
$$

The dynamical system with the transfer function $K(s)$ is called the controller. You can easily verify that in this case the relation \eqref{propcont} has a more general form

$$
T_c(s) = \frac{K(s) T(s)}{1 + K(s) T(s)}
$$

Before delving into this general of a system, let's explore this type of tracking control system further on a simpler example. Let's assume our original system that we want to control (the plant) is given by the second-order differential equation
\begin{equation}
\label{secondord}
m \ddot{x} + \beta \dot{x} + \kappa x = u.
\end{equation}
This should be very familiar from an Elementary Differential Equations course as a model for mass-spring system in which $x$ represents the position from the equilibrium at time $t \in [0, \infty)$ of the object of mass $m$ attached to a spring with spring constant $\kappa$ moving in a medium offering a resistance that is $\beta$ times the instantaneous velocity under an external force $u$. We will see that this equation is also very important in many other applications as oftentimes it approximates dynamics that are much more complex (e.g. an airplane flight).

Assuming our output is simply $y(t) = x(t)$, and taking the Laplace Transform of both sides and assuming zero initial conditions you can verify that the open-loop input/output relation is:
\begin{equation}
\label{siso}
Y(s) = \frac{1}{m s^2 + \beta s + \kappa} U(s).
\end{equation}
If it's been a while since differential equations here's a refresher on Laplace Transforms of derivatives -> [Laplace Transforms](http://tutorial.math.lamar.edu/Classes/DE/LaplaceIntro.aspx)

First we investigate the problem as an open-loop control. At this point do the following as homework:

<div class='bordered'>

1. Write the second order scalar differential equation \eqref{secondord} above as a first order system (recall that you want to define a new state variable as the derivative of $x$). You may abuse notation and use $x = [x, \dot{x}]^T$ as the name of the resulting vector. Then the resulting system should be in the form from last lecture.

   \[
   \dot{x}(t) = F x(t) + G u(t),
   \]
   \[
   y(t) = x(t).
   \]
   So you just have to find $F$ and $G$.

   For nonzero $u$ this is a nonhomogeneous system. What are the eigenvalues and eigenvectors of $F$? For this it will be helpful to define the natural frequency $\omega := \sqrt{\frac{\kappa}{m}}$ and the damping ratio $\xi := \frac{\beta}{2 m \omega}$ and consider several cases depending on the values of the parameters. Find the fundamental matrix $\Phi(t)$ and the solution of the corresponding homogeneous system in each of the cases. You are free to use any differential equations textbook or web resource as a reference.

   Write the 'Variation of Parameters' formula for the nonhomogeneous equation (this is the integral formula for the solution of nonhomogeneous system, do NOT derive this formula!).

2. Assume initial conditions are $x(0) = \dot{x}(0) = 0$.

   Go back to the system in the previous part. Take the Laplace Transform of the system and show that you get the same relation \eqref{siso} whether you work with the second order scalar equation or the corresponding first order system.

   Verify that it is also the same as was derived in the last lecture, i.e.:

   $$
   T(s) = [H (sI - F)^{-1} G]
   $$
   In this case $H= [1,0]^T$, since the output $y(t) = x(t)$.

   Assume $u = u_0$ is constant. Here we consider the equation only on the interval $t \in [0, \infty)$. We could consider $t \in (-\infty, \infty)$ and define $u$ to be a unit step function (i.e. equal to $0$ for $t < 0$ and $u_0$ for $t \ge 0$). Such formulation will prove to be useful later, but don't worry about it for now. (Hint: in either case the Laplace Transform is $u_0/s$).

   What is the steady state in this case? (Note you can use the system to find this, but also the scalar equation \eqref{secondord} gives this immediately since the steady state corresponds to the derivatives equal to zero).

   Write down the expression for $Y(s)$ in this case. Write the expression for $Y(s)$ in terms of the parameters $\omega$ and $\xi$.

3. Solve the equation by finding the inverse Laplace Transform $y(t)$. This is the most technical step. You'll have to do a partial fraction decomposition and consider several cases depending on the value of $\xi$. There should be many parallels between this and the fundamental matrix analysis from the first part. Again you are free to use any differential equations textbook or web resource as a reference.

   Note that the zeros of the denominator of the transfer function which you had to calculate as part of the partial fraction decomposition are the same as the eigenvalues of the matrix $F$ from the first step.

   From the abstract point of view, this is simply the consequence of the inversion formula of a matrix in terms of it's adjoint matrix (matrix of cofactors)
   $$
   T(s) = [H (sI - F)^{-1} G] = \frac{H Adj(sI - F) G}{det(sI - F)}
   $$
   As you can see the condition that the denominator equals $0$ is exactly the same condition as $s$ being an eigenvalue of $F$.

4. What happens in each of the cases when $t \rightarrow \infty$? How does this behavior depend on the zeros of the denominator of the transfer function $T(s)$ (presumably you found those when doing the partial fraction decomposition).

5. Choose $\kappa = 1$ and $\omega = 2 \pi$ and plot the solution for various values of $\xi$. Make sure you select at least one value from each of the cases.

</div>

As you can see even for a simple second order constant coefficient differential equation there could be a lot of different behaviors of the solution. If the idea is to use a control to drive the output $y(t)$ to a steady state, the success (and performance) of such endeavor depends critically on the parameters of the system, which might be fixed.

Here is a natural question then. If the behavior is not what we want, can a feedback mechanism improve the situation?
Say we want to 'drive' $y(t)$ to the value $y_0$. Going back to \eqref{propcont}, you can imagine the simplest type of command signal $y_d$ to be a constant command $y_d(t) = y_0$. Using the corresponding Laplace Transform $Y_d(s) = y_0/s$ in \eqref{propcont} results in

$$
Y(s) = \frac{k u_0 T(s)}{s (1 + k T(s))} = T_c(s) Y_d(s),
$$

where

$$
T_c(s) = \frac{k T(s)}{(1 + k T(s))}
$$

Let us now write the transfer function $T(s)$ as

$$
T(s) = N(s)/D(s),
$$

where $N(s)$ and $D(s)$ are polynomials of degree $m$ and $n$ $(m \le n)$ respectively representing the numerator and the denominator. Then some algebra gives

$$
T_c(s) = \frac{k N(s)}{D(s) + k N(s)}
$$

as before.

As you saw in the exercise the stability and performance characteristics of the plant depend on the sign of the real parts of zeros of the denominator $D(s)$ (note that these were also the eigenvalues of the original system). In particular to reach the desired steady state it must be true that the real parts of those zeros are negative). By introducing the feedback control we changed the problem into studying the zeros of the new denominator $D(s) + k N(s)$, so the question becomes whether we can choose $k$ to have the poles (zeros of the denominator) of the new transfer function have negative real parts. Or more generally how do the roots of

$$
D(s) + k N(s) = 0
$$

relate to the roots of

$$
D(s) = 0.
$$

This is the question of the next lecture.
