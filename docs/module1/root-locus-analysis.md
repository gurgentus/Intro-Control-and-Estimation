# Root Locus Analysis

<p class="math-connection"><em>Mathematical connections: complex analysis, asymptotic analysis.</em></p>

We ended the last section with an open loop transfer function

$$
T_o(s) = \frac{N(s)}{D(s)},
$$

and a closed loop transfer function

$$
T_c(s) = \frac{k N(s)}{D(s) + kN(s)}
$$

that was obtained with proportional control. The poles of $T_c$ correspond to the roots of
\begin{equation}
\label{zeros}
D(s) + k N(s) = 0,
\end{equation}
where we can assume without loss of generality that $D(s)$ is a polynomial of degree $n$ with leading coefficient $1$, $N(s)$ is a polynomial of degree $m$, $m \le n$, and $N(s)$, $D(s)$ have no common factors. The method described below due to Evans (..) sheds some light on how these roots depend on the parameter $k$. Clearly as $k \rightarrow 0$ the poles of $T_c$ approach the zeros of $D(s)$, which are also the poles of $T_o$. Rewriting the equation in the form

$$
N(s) + \frac{1}{k} D(s) = 0,
$$

we note that as $k \rightarrow \pm\infty$ any root that stays bounded must approach a zero of $N(s)$.

Let us rewrite the equation one more time as
\begin{equation}
\label{rloc}
k \frac{N(s)}{D(s)} = -1.
\end{equation}
This is of course true only if $N(s) \ne 0$, but this is clearly the case as otherwise \eqref{zeros} would imply that $D(s) = 0$, implying that both $N(s)$ and $D(s)$ have a common factor $s$. There are several rules which must be satisfied that can help in sketching the poles as $k$ is varied.

Let $s$ be such a pole. First, note that since we assume that the coefficients are real, any roots that have an imaginary part must come in complex conjugate pairs. In other words, the root locus picture is symmetric about the real axis. Let $z_1, \dots, z_m$ be the roots of $N(s)$ (i.e. zeros of $T_o$) and $p_1, \dots, p_n$ be the roots of $D(s) = 0$ (i.e. the poles of $T_o$). Then

$$
k \frac{N(s)}{D(s)} = k \frac{b_0 (s - z_1) \dots (s-z_m)}{(s-p_1) \dots (s-p_n)} = -1.
$$

Note that for real $s$ and any two zeros or poles that are complex conjugate pairs we have

$$
(s - z) (s-\bar{z}) = (s-z) (\overline{s-z}) = r e^{i \phi} r e^{-i \phi} = r^2 \ge 0,
$$

where $s-z = r e^{i \phi}$ uses the Euler representation of a complex number.

Hence, in order to have a negative product, if $s$ is a real pole of $T_c$, then if $k > 0$ there must be an odd number of real zeros or poles of $T_o$ to the right of $s$. Similarly, if $k < 0$ there must be an even number of real zeros or poles of $T_o$ to the right of $s$.

Also note that if for some value of $k$ a pole or a zero is located on the real axis, the only way for it to 'break-away' from the real axis is to split into two branches of the root locus to preserve the symmetry about the real axis. Due to continuity properties of the roots such breakaway points can be created only when two real roots collide (or start out as a higher multiplicity root).

How can these rules be used? The analysis assumes that we can plot the zeros and poles of the original open-loop transfer function $T_o$. They are customarily marked with an o and an x respectively on the complex plain. Consider various situations.

- If the number of poles and zeros of $T_o$ is the same they should be connected without breaking the symmetry of conjugate roots.
- If $T_o$ has one pole and no zeros on the real axis, there must be a branch of the root locus covering the whole region to the left of the pole (for $k > 0$) or to the right of the pole (for $k < 0$) 'converging' to $+\infty$ or $-\infty$ respectively.
- Similarly, if the original open-loop transfer function has exactly one pole and one zero next to each other, they are either connected by a branch of the root locus or there cannot be a branch of the root locus between them (based on Rule 1 and dependent on the sign of $k$).
- Any pole of $T_o$ that doesn't have a zero of $T_o$ to 'go to' must diverge to infinity.

There are other considerations one might consider when trying to draw a root locus by hand, however, with easy access to computational methods we can mostly rely on computers to plot the root locus in real time as we vary $k$ or other parameters. We will develop code to do this in the next few lectures.

We end this section with a slightly more technical argument that helps us understand the angle of the asymptotes of the poles diverging to infinity.

Let us write \eqref{rloc} as

$$
1 +  k \frac{b_0 (s - z_1) \dots (s-z_m)}{(s-p_1) \dots (s-p_n)} = 0.
$$

Multiplying out the numerator and the denominator of the rational function above we write it in the expanded form

$$
1 + k b_0 \frac{s^m - s^{m-1} \sum p_i + o(s^{m-1})}{s^n - s^{n-1} \sum z_i + o(s^{n-1})} = 0
$$

Multiplying both sides by $s^{n-m}$,

$$
s^{n-m} + k b_0 \frac{s^n - s^{n-1} \sum p_i + o(s^{n-1})}{s^n - s^{n-1} \sum z_i + o(s^{n-1})} = 0
$$

and dividing the numerator and denominator of the second term by $s^n$ yields,

$$
s^{n-m} + k b_0 \frac{1 - \frac{1}{s} \sum p_i + o(1/s)}{1 - \frac{1}{s} \sum z_i + o(1/s)} = 0
$$

Using the geometric series formula $\frac{1}{1 - t} = 1 + t + o(t)$ (alternatively the Taylor expansion), we write

$$
\frac{1}{1 - \frac{1}{s} \sum z_i + o(1/s)}  = 1 + \frac{1}{s} \sum z_i + o(1/s),
$$

and obtain

$$
s^{n-m} + k b_0 \left(1 - \frac{1}{s} \sum p_i + o(1/s) \right) \left( 1 + \frac{1}{s} \sum z_i + o(1/s) \right) + o(1/s).
$$

or multiplying out the leading terms

$$
s^{n-m} + k b_0 \left( 1 + \frac{1}{s} \left( \sum z_i - \sum p_i \right) + o(1/s)  \right) = 0.
$$

Clearly the different terms have varied behavior as the magnitude of $s$ diverges to $\infty$. This is the key idea of asymptotic analysis.

Let's, multiply the equation by $s$

$$
s^{n-m+1} + k b_0 \left( s + \left( \sum z_i - \sum p_i \right) + o(1)  \right)  = 0
$$

and introduce the decomposition $s = s_0 + r e^{i \phi}$. We will see if we can choose $s_0$ in such a way that $\phi$ stays constant in the limit.

Using the binomial theorem,

$$
s^{n-m+1} = (r e^{i \phi} + s_0)^{n-m+1} = r^{n-m+1} e^{(n-m+1) i \phi} + (n-m +1) r^{n - m} e^{i (n-m) \phi} s_0 + o(r^{n-m - 1})
$$

which must equal

$$
- k b_0 \left( s_0 + r e^{i \phi} + \left( \sum z_i - \sum p_i \right) + o(1)  \right)
$$

Dividing both sides by $r^{n-m+1}$ yields our final asymptotic equation

$$
e^{(n-m+1) i \phi} + \frac{n-m +1}{r} e^{i (n-m) \phi} s_0 + o(1/r) = -\frac{k}{r^{n-m}} b_0 e^{i \phi} - \frac{k}{r^{n-m+1}} b_0  \left( s_0 + \left( \sum z_i - \sum p_i \right)  \right) + o\left(\frac{k}{r^{n-m+1}}\right).
$$

For this to be true as $k,r \rightarrow \infty$, it must hold that

$$
e^{(n-m+1) i \phi}  \rightarrow -\frac{k b_0}{r^{n-m}} e^{i \phi}
$$

and consequently

$$
\frac{n-m +1}{r} e^{i (n-m) \phi} s_0 + o(1/r) \rightarrow - \frac{k}{r^{n-m+1}} b_0  \left( s_0 + \left( \sum z_i - \sum p_i \right)  \right)
$$

These equations imply that as $k \rightarrow \infty$,

$$
\phi \rightarrow \frac{l \pi}{n-m},
$$

where $l$ is odd if $k \ge 0$ and even if $k \le 0$, and

$$
(n-m+1) s_0 \rightarrow \left( s_0 + \left( \sum z_i - \sum p_i \right)  \right)
$$

resulting in

$$
s_0 \rightarrow \frac{\sum z_i - \sum p_i}{n-m}
$$

The last expression being necessarily real, we deduce that the asymptotes radiate out of

$$
\frac{\sum z_i - \sum p_i}{n-m}
$$

on the real axis with the angle of an odd or even multiple of

$$
\frac{\pi}{n-m},
$$

for $k > 0$ and $k < 0$ respectively.
