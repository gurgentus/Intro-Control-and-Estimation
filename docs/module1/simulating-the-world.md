# Extra: Simulating the World

<p class="math-connection"><em>Mathematical connections: numerical analysis, systems of linear differential equations</em></p>

Before spending too much time on designing fancy control systems, it would be wise to come up with a plan to test what we do. This is where simulations come into play.

Recall that our system is described by a set of differential equations, which for the simpler case of no disturbance and measurement error would look like this:

\begin{equation}
\label{nonlin}
\dot{x}(t) = f(x(t), u(t), t)
\end{equation}

and an output equation

$$
y(t) = h(x(t)),
$$

where $u$ is the control which we will specify in some way, $x$ is the resulting state, which is nothing other than the solution to the resulting differential equation, and $y$ is the output that we are interested in which in some way depends on the state $x$.

In particular, we often deal with linear equations of the form

$$
\dot{x}(t) = F(t) x(t) + G(t) u(t),
$$

$$
y(t) = H(t) x(t).
$$

Once you've designed your controller and specified how to chose the control $u(t)$ you'd naturally want to see what the output $y(t)$ is for such control. This is involves nothing other than solving the differential equations. Depending on the equation there is a very good chance that we would have to do that numerically (either because no analytic solution can be written or even if we have the solution evaluating it would require numerical computations). We'll discuss two methods to numerically solve systems of differential equations. The first, referred to as Runge-Kutta integration can be applied to either of the systems above, while the second will use the extra structure afforded by linearity and naturally will be applied to the linear system (although using the concept of linearization it can be adapted for nonlinear systems as well).

## Runge-Kutta Method

To see how the Runge-Kutta method works, we use the Fundamental Theorem of Calculus to rewrite \eqref{nonlin} as

$$
x(t_k) = x(t_{k-1}) + \int_{t_{k-1}}^{t_k} f(x(s), u(s), s) ds.
$$

where $t_{k-1}$ and $t_k$ are any two values of $t$. The reason for introducing fancy indices is to iterate this process using the fact that we know the initial condition $x(t_0)$. There is only one problem with this. The expression under the integral sign above depends on all of the time values between $t_{k-1}$ and $t_k$, so we are left with trying to approximate this value. The fourth order Runge-Kutta algorithm does this in the following way:

<div class="bordered">

$$
x(t_k) = x(t_{k-1}) + \frac{1}{6} (\Delta x_1 + 2 \Delta x_2 + 2 \Delta x_3 + \Delta x_4),
$$

where

$$
\Delta x_1 = f(x(t_{k-1}), u(t_{k-1})) \Delta t,
$$

$$
\Delta x_2 = f\left(x(t_{k-1}) + \Delta x_1/2, u(t_{k-1/2})\right) \Delta t,
$$

$$
\Delta x_3 = f\left(x(t_{k-1}) + \Delta x_2/2, u(t_{k-1/2})\right) \Delta t,
$$

$$
\Delta x_4 = f\left(x(t_{k-1}) + \Delta x_3, u(t_{k})\right) \Delta t.
$$

</div>

Here $\Delta t = t_k - t_{k-1}$ is typically chosen uniform for all values of $k$, but does not have to. Note that we are approximating $x$ based on the previous known value $x(t_{k-1})$, while for $u$ we are using the value in the middle of the interval $u(t_{k-1/2})$ as well. If control is closed loop, we would use the same type of approximation for $u$ as we do for $x$. If you are interested to learn more (including why this works) check out any textbook on numerical methods. At this point it would be great practice to solve a simple scalar differential equation like $\dot{x} = x^2, x(0) = 1$ using this method. How does it compare with the correct solution as you make $\Delta t$ smaller?

Great, you now have a powerful tool solving differential equations. You can choose some way to visualize the state $x$ at each step of your iterative numerical algorithm and you have yourself a real-world simulation!

## Matrix Exponential Method for Linear Systems

We'll finish this lesson with a different approach that is suited for linear equations. These have a lot of extra structure that in some cases allow explicit formulas for the solutions. With such a system we associated an invertible fundamental matrix $\Phi(t)$, whose columns consist of solutions to the homogeneous differential equation

$$
\dot{x}(t) = F(t) x(t).
$$

Such $\Phi$ is not unique. At this point you might want to take a look at the notes, [Linear Systems](http://gurgentus.name/work/wp-content/uploads/2017/02/Notes1130.pdf), for a more detailed description of the theory behind linear systems.

Using properties of matrix multiplication this is equivalent to saying that $\Phi$ satisfies the matrix equation

$$
\dot{\Phi}(t) = F(t) \Phi(t),
$$

where the dot notation implies differentiation of each element of the matrix. It can be shown that such a matrix allows us to write the solution to

$$
\dot{x}(t) = F(t) x(t), \quad x(t_0) = x_0,
$$

simply as

$$
x(t) = \Phi(t) \Phi^{-1}(t_0) x_0.
$$

Again anticipating an iterative procedure we can rename the states to

$$
x(t_{k}) = \Phi(t_k) \Phi^{-1}(t_{k-1}) x(t_{k-1}) = U(t_{k-1}, t_k) x(t_{k-1}),
$$

where the matrix $U(t_{k-1}, t_k) = \Phi(t_k) \Phi^{-1}(t_{k-1})$ is called a state transition matrix since multiplication by it maps the state at $t_{k-1}$ to $t_k$. This is great! If we know a fundamental matrix $\Phi$ we can apply this iterative process starting at $t_0$ where we know the initial condition. If the equation is not homogeneous, i.e. we are solving

$$
\dot{x}(t) = F(t) x(t) + e(t),
$$

one can show relatively easily that the corresponding solution is

$$
x(t) = \Phi(t) \Phi^{-1}(t_0) x_0 + \int_{t_0}^t \Phi(t) \Phi^{-1}(s) e(s) ds,
$$

or for iterative purposes

$$
x(t_k) = \Phi(t_k) \Phi^{-1}(t_{k-1}) x(t_{k-1}) + \int_{t_{k-1}}^{t_k} \Phi(t_k) \Phi^{-1}(s) e(s) ds.
$$

This is the famous 'Variation of Parameters' formula for the solution of nonhomogeneous system. For open loop control $e(s) = G(s) u(s)$ and so the solution formula becomes:

$$
x(t_k) = \Phi(t_k) \Phi^{-1}(t_{k-1}) x(t_{k-1}) + \int_{t_{k-1}}^{t_k} \Phi(t_k) \Phi^{-1}(s) G(s) u(s) ds.
$$

This is all great, but there is one problem, we need to find this fundamental matrix $\Phi$. Unfortunately in most cases this is not possible. Luckily for us things become simpler if $F$ is constant. For the resulting constant coefficient system a fundamental matrix is expressed in terms of a matrix exponential,

$$
\Phi(t) = e^{F t}
$$

which can be calculated based on the eigenvalues of $F$. This particular choice of $\Phi$ also has the property that $\Phi(0) = I$. See any differential equations text for more on how to calculate this. The definition of the matrix exponential is based on the Taylor series expansion of the exponential function and luckily for us shares many properties with its scalar counterpart. In particular

$$
\Phi^{-1}(t) = e^{-F t},
$$

and

$$
\Phi(t) \Phi^{-1}(s) = e^{F(t-s)}.
$$

It follows that

$$
x(t_k) = \Phi(t_k) \Phi^{-1}(t_{k-1}) x(t_{k-1}) + \int_{t_{k-1}}^{t_k} \Phi(t_k) \Phi^{-1}(s) G(s) u(s) ds
$$

$$
= e^{F(t_k - t_{k-1})} x(t_{k-1}) + \int_{t_{k-1}}^{t_k} e^{F(t_k-s)} G(s) u(s) ds
$$

If, in addition $u$ and $G$ are constant on the interval (this will often be the case in our control systems)

$$
x(t_k) = e^{F(t_k - t_{k-1})} x(t_{k-1}) + \left( \int_{t_{k-1}}^{t_k} e^{F(t_k-s)} ds \right) G u(t_{k-1}).
$$

Don't forget that the integral above is actually a matrix that is then multiplied by $G u$. Finally we can change variables in the integral $\tau = s - t_{k-1}$ to obtain

$$
x(t_k) = e^{F(t_k - t_{k-1})} x(t_{k-1}) + \left( \int_{0}^{t_k-t_{k-1}} e^{F(t_k-t_{k-1}-\tau)} d\tau \right) G u(t_{k-1}).
$$

$$
x(t_k) = e^{F(\Delta t)} x(t_{k-1}) + e^{F(\Delta t)} \left( \int_{0}^{\Delta t} e^{-F \tau} d\tau \right) G u(t_{k-1}).
$$

The final step is to note that

$$
\int_{0}^{\Delta t} e^{-F \tau} d\tau = -[ e^{-F(\Delta t)} - I ] F^{-1}.
$$

Here $I$ is the identity matrix and this formula a consequence of the definition of the matrix exponential (note that if $F$ was a scalar instead of a matrix we would get the usual integration formula for the exponential).

Our final solution is then:

$$
x(t_k) = e^{F(\Delta t)} x(t_{k-1}) + e^{F(\Delta t)} [ I - e^{-F(\Delta t)} ] F^{-1}G u(t_{k-1}).
$$

or combining the exponentials

<div class="bordered">

$$
x(t_k) = e^{F(\Delta t)} x(t_{k-1}) + [e^{F(\Delta t)} - I ] F^{-1}G u(t_{k-1}).
$$

</div>

Compared to the iteration formula that we obtained with Runge-Kutta algorithm, the above solution is exact even if $\Delta t$ is large. Of course it is only valid if $F$, $G$, and $u$ are constant on the interval.
