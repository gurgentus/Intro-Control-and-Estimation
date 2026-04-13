# Cloud Controls & Simulation Toolbox

<style>
/* Hide both sidebars on this page - force with !important */
.md-sidebar--primary {
  display: none !important;
  visibility: hidden !important;
}

.md-sidebar--secondary {
  display: none !important;
  visibility: hidden !important;
}

.md-sidebar {
  display: none !important;
}

/* Expand main content area */
.md-content {
  max-width: none !important;
  margin: 0 !important;
}

.md-main__inner {
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.md-grid {
  max-width: none !important;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Force content to take full width */
@media screen and (min-width: 76.25em) {
  .md-sidebar--primary {
    display: none !important;
  }
  .md-sidebar--secondary {
    display: none !important;
  }
}

/* Single-column layout — iframe below content */
.md-content__inner {
  display: block;
  max-width: 100% !important;
}
</style>

---

=== "About"

    The Cloud Controls & Simulation Toolbox (CCST) is a browser-based environment for controls engineering, simulation, and orbital mechanics. The backend is built with Python (FastAPI), using NumPy and SciPy for mathematical computations. The frontend terminal uses jQuery Terminal with Bokeh for interactive plotting. Simulations can run locally or as distributed ROS2 nodes in Docker or Kubernetes, with optional 3D visualization via Foxglove Studio.

    All commands use **arrow syntax** to name outputs: `command args -> output_name`. Use `gdisplay` to view any stored variable (matrices, systems, plots, 3D scenes). Scripts (`.ccst` files) can be run with the `run` command.

    !!! info "Contact"
        For questions and bugs please email: greg.hayrapetyan AT gmail.com

=== "General"

    ### Matrices and Display

    Define a matrix using MATLAB-style or JSON syntax:
    ```
    matrix '[1 2; 3 4]' -> A
    matrix '[[1,2],[3,4]]' -> A
    ```

    Display variables with `gdisplay A` (graphical LaTeX rendering) or `display A` (console text).

    Calculate eigenvectors and eigenvalues:
    ```
    modes A -> V E
    ```

    Set display precision (0-16 decimal places, or `full`):
    ```
    precision 6
    ```

    ### Running Scripts

    Execute a `.ccst` script file (lines starting with `#` are comments):
    ```
    run example.ccst
    ```

=== "Controls"

    ### Controls System Commands

    Let us analyze longitudinal dynamics representative of a transport aircraft, trimmed at $V_0 = 250$ ft/s and flying at a low altitude. The example is taken from 'Robust and Adaptive Control: With Aerospace Applications' by Eugene Lavretsky and Kevin Wise.

    #### Defining the System

    The linearized dynamics are given by the matrix:

    $$
    A = \begin{pmatrix}
    -0.038 & 18.984 & 0 & -32.174 \\
    -0.001 & -0.632 & 1 & 0 \\
    0 & -0.759 & -0.518 & 0 \\
    0 & 0 & 1 & 0
    \end{pmatrix}
    $$

    To enter this matrix in CCST:
    ```
    matrix '[[-0.038, 18.984, 0, -32.174], [-0.001,-0.632, 1, 0], [0, -0.759, -0.518, 0], [0, 0, 1, 0]]' -> A
    ```

    View the matrix with `gdisplay A`.

    Calculate eigenvectors and eigenvalues:
    ```
    modes A -> V E
    ```

    #### Control Matrices

    Define the input, output, and feedthrough matrices:
    ```
    matrix '[[10.1, 0], [0, -0.0086], [0.025, -0.011], [0,0]]' -> B
    matrix '[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]' -> C
    matrix '[[0, 0], [0, 0], [0, 0], [0, 0]]' -> D
    ```

    #### Creating State-Space System

    Define the state-space system ($\dot{x} = Ax + Bu$, $y = Cx + Du$):
    ```
    ss A B C D -> G
    ```

    View the system with `gdisplay G`. Generate a block diagram with:
    ```
    diagram G -> G_diagram
    gdisplay G_diagram
    ```

    #### Labeling States, Inputs, and Outputs

    Label the second input as "elevator" and the second output as "alpha":
    ```
    control 2 G -> elevator
    output 2 G -> alpha
    ```

    States can also be labeled:
    ```
    state 1 G -> position
    state 2 G -> velocity
    ```

    #### Simulation

    Simulate the step response to a 0.5 radian elevator deflection for 5 seconds:
    ```
    step alpha G elevator 0.5 5 -> alpha_plot
    gdisplay alpha_plot
    ```

    Simulate response to initial conditions with a constant input:
    ```
    response alpha G '[[0],[0]]' '[[0]]' 5.0 -> response_plot
    gdisplay response_plot
    ```

    #### Closed-Loop Control

    Define a controller and arrange into a feedback loop:
    ```
    controller A B1 B2 C D1 D2 -> K
    feedback G K -> G_cl
    ```

    #### PID Control

    Wrap a PID controller around a plant output:
    ```
    pid G alpha 1.0 0.5 0.1 -> G_pid
    ```
    where the arguments are: plant, output name, $K_p$, $K_i$, $K_d$.

    #### Transfer Functions and Poles

    Compute the transfer function and plot poles:
    ```
    tf G -> G_tf
    poles G -> pole_plot
    gdisplay pole_plot
    ```

    Add `zeros` to also show zeros: `poles G zeros -> pz_plot`.

=== "Modern Control"

    ### LQR, Kalman, and LQG

    #### LQR State Feedback

    Design an optimal state feedback gain by solving the algebraic Riccati equation. Define weighting matrices $Q$ (state cost) and $R$ (control cost):
    ```
    matrix '[10 0; 0 1]' -> Q
    matrix '[1]' -> R
    lqr G Q R -> K_lqr
    ```

    Form the closed-loop system with state feedback ($u = r - Kx$):
    ```
    statefb G K_lqr -> G_cl
    ```

    Check closed-loop stability:
    ```
    poles G_cl -> cl_poles
    gdisplay cl_poles
    ```

    #### Kalman Filter

    Define a stochastic system with process and measurement noise:
    ```
    stochastic G G_noise Qn Rn -> G_stoch
    ```
    where `G_noise` is the noise input matrix, `Qn` is process noise covariance, `Rn` is measurement noise covariance.

    Design the optimal Kalman filter gain:
    ```
    kalman G_stoch -> L
    ```

    Create an observer (state estimator):
    ```
    observer G_stoch L -> obs
    ```

    #### LQG Controller

    Combine LQR state feedback and Kalman observer into an LQG controller:
    ```
    lqg G G_cl obs -> G_lqg
    ```

    #### System Augmentation

    Add an integrator on an output (for zero steady-state error):
    ```
    integrate G alpha -> G_aug
    ```

    Add a tracking error output ($e = r - y$):
    ```
    error G alpha -> G_err
    ```

    Add saturation (actuator limits):
    ```
    saturation G -1.0 1.0 -> G_sat
    ```

    Expose an internal signal as a plottable output:
    ```
    signal G u -> G_sig
    ```

    Create a linear combination of outputs:
    ```
    combine G 1.0 x -0.5 y combined -> G_comb
    ```

    #### Cascade Control

    Build inner/outer loop cascade architecture:
    ```
    cascade outer_cl inner_cl Pmode -> G_cascade
    ```

=== "Simulation"

    ### General Simulation

    The `sim` command simulates any system (linear or nonlinear) with flexible input options.

    #### Basic Simulation

    Simulate a system from initial conditions for a given duration:
    ```
    sim G x0:[1,0,0,0] t:10 -> sim_plot
    gdisplay sim_plot
    ```

    Specify a constant input and timestep:
    ```
    sim G x0:[0,0] t:5 u:[0.5] dt:0.01 -> sim_plot
    ```

    Plot specific outputs by name:
    ```
    sim G x0:[0,0,0,0] t:10 dt:0.1 alpha theta -> sim_plot
    ```

    #### Nonlinear Dynamics

    Define arbitrary nonlinear systems using Python/NumPy expressions:
    ```
    dynamics f:"[x[1], -np.sin(x[0]) - 0.1*x[1]]" n:2 -> pendulum
    ```

    This defines a damped pendulum: $\dot{\theta} = \omega$, $\dot{\omega} = -\sin(\theta) - 0.1\omega$.

    The key:value arguments are:

    | Key | Required | Description |
    |-----|----------|-------------|
    | `f:` | yes | State derivative expression $\dot{x} = f(x, u)$ |
    | `n:` | yes | Number of states |
    | `m:` | no | Number of inputs (default: 0) |
    | `p:` | no | Number of outputs (default: n) |
    | `y:` | no | Output expression $y = g(x, u)$ (default: full state) |

    Simulate it:
    ```
    sim pendulum x0:[2.5,0] t:15 -> pendulum_sim
    gdisplay pendulum_sim
    ```

    Systems with inputs:
    ```
    dynamics f:"[x[1], -np.sin(x[0]) - 0.1*x[1] + u[0]]" n:2 m:1 -> forced_pendulum
    sim forced_pendulum x0:[0,0] t:10 u:[0.5] -> forced_sim
    ```

    Systems with a custom output map (e.g., the 11-state rocket with 9 measured outputs):
    ```
    dynamics f:"[x[3], x[4], x[5], ...]" n:11 m:3 p:9 y:"[x[0], x[1], ...]" -> rocket
    ```

    #### Scheduled Inputs

    Use `target` and `chain` to create piecewise input schedules (see Rendezvous & Docking tab), then pass them to `sim`:
    ```
    sim cw_plant x0:[-0.1,-1.0,0,0,0,0] t:3100 schedule:docking_sched dt:1 x y z -> traj
    ```

    #### 3D Visualization

    Create an interactive 3D scene from simulation results:
    ```
    scene3d sim_result x y z -> scene
    gdisplay scene
    ```

    The scene includes a trajectory trail, play/pause controls, and orbit camera.

=== "RDV & Docking"

    ### Rendezvous and Docking

    CCST includes a complete set of tools for spacecraft proximity operations using Clohessy-Wiltshire (CW) relative motion dynamics.

    #### Setup: CW Plant

    Define the linearized relative motion dynamics in the LVLH frame for a 400 km LEO orbit ($n = 0.00113$ rad/s):
    ```
    run rdv_setup.ccst
    ```

    This creates `cw_plant` (6-state linear system), an LQR controller `K_rdv`, and the closed-loop system `rdv_cl`.

    #### Closed-Loop Rendezvous

    Simulate a V-bar approach from 1 km behind and 100 m below:
    ```
    sim rdv_cl x0:[-0.1,-1.0,0,0,0,0] t:3000 u:[0,0,0] dt:1 x y z -> vbar_pos
    gdisplay vbar_pos
    scene3d vbar_pos -> vbar_3d
    gdisplay vbar_3d
    ```

    #### Two-Impulse Targeting

    Solve for the impulsive burns needed to transfer between two states:
    ```
    target cw_plant x0:[-0.1,-1.0,0,0,0,0] xf:[0,-0.2,0,0,0,0] t:1400 -> phase1
    ```

    For finite-duration burns (e.g., 30-second burns):
    ```
    target cw_plant x0:[-0.1,-1.0,0,0,0,0] xf:[0,-0.2,0,0,0,0] t:1400 duration:30 -> phase1
    ```

    For thrust-limited burns:
    ```
    target cw_plant x0:[0,0,0.05,0,0,0] xf:[0,0,0,0,0,0] t:2780 thrust:0.001 -> phase1
    ```

    #### Multi-Phase Docking

    Chain multiple targeting phases with hold points:
    ```
    target cw_plant x0:[-0.1,-1.0,0,0,0,0] xf:[0,-0.2,0,0,0,0] t:1400 duration:30 -> phase1
    target cw_plant x0:[0,-0.2,0,0,0,0] xf:[0,-0.02,0,0,0,0] t:800 duration:30 -> phase2
    target cw_plant x0:[0,-0.02,0,0,0,0] xf:[0,-0.006,0,0,0,0] t:400 duration:20 -> phase3

    chain phase1 hold:300 phase2 hold:200 phase3 -> docking_sched
    ```

    Simulate the complete approach:
    ```
    sim cw_plant x0:[-0.1,-1.0,0,0,0,0] t:3100 schedule:docking_sched dt:1 x y z -> docking_traj
    gdisplay docking_traj
    scene3d docking_traj -> docking_3d
    gdisplay docking_3d
    ```

    Run the full docking scenario:
    ```
    run rdv_docking.ccst
    ```

    #### Available RDV Scripts

    | Script | Scenario |
    |--------|----------|
    | `rdv_setup.ccst` | CW plant + LQR controller setup |
    | `rdv_vbar.ccst` | V-bar approach with LQR |
    | `rdv_outofplane.ccst` | Out-of-plane correction |
    | `rdv_ellipse.ccst` | Safety ellipse departure |
    | `rdv_targeting.ccst` | Two-impulse open-loop targeting |
    | `rdv_finitethrust.ccst` | Finite-thrust maneuver |
    | `rdv_attitude.ccst` | Attitude control |
    | `rdv_coupled.ccst` | Coupled translation + attitude cascade |
    | `rdv_docking.ccst` | Multi-phase docking with finite burns |
    | `rendezvous.ccst` | Run all scenarios sequentially |

=== "ROS2 & Foxglove"

    ### ROS2 Distributed Simulation

    The `ros2_sim` command runs a simulation as distributed ROS2 nodes, with each block in the system's block diagram running as a separate node. This supports real-time pacing and 3D visualization via Foxglove Studio.

    #### Basic ROS2 Simulation

    ```
    ros2_sim G x0:[1,0,0,0] t:10 dt:0.01 -> ros2_result
    ```

    #### Foxglove Visualization

    Add the `foxglove` flag to publish visualization markers:
    ```
    ros2_sim cw_plant x0:[-0.1,-1.0,0,0,0,0] t:3100 schedule:docking_sched dt:1 foxglove rtf:10 scale:100 x y z -> docking_ros2
    ```

    Parameters:

    - `foxglove`: enable Foxglove bridge on `ws://localhost:8765`
    - `rtf:<factor>`: real-time factor (0 = fast as possible, 1 = real-time, 10 = 10x speed)
    - `scale:<factor>`: position scaling for visualization (default 1000, i.e. km to m)
    - `frame:<var>:<parent>:<child>`: add TF frame transforms

    Connect [Foxglove Studio](https://studio.foxglove.dev) to `ws://localhost:8765` to view the 3D visualization in real time.

    #### Managing Simulations

    List running simulations:
    ```
    ros2_ps
    ```

    Stop all running simulations:
    ```
    ros2_stop
    ```

    #### Kubernetes Deployment

    When deployed to Kubernetes (`CCST_SIM_BACKEND=k8s`), simulations run as K8s Jobs with S3-based data transfer. The system automatically handles job creation, data upload/download, and cleanup. See the [K8s Deployment Guide](https://github.com/gurgentus/ccst) for setup instructions.

=== "Path Planning"

    ### Path Planning Toolbox

    For speed the toolbox uses Python code for some of the functionality and C++ code for others.

    #### Local Planner and 2D Car Dynamics

    Algorithms like Dijkstra's or RRT/RDT are often very useful as global path planners, however there are situations when dynamic constraints have to be taken into account. There are several ways to model these dynamics. One could describe the car with the following **state variables**: the position of its center of mass in the Cartesian coordinates, $x$, $y$, its angle of orientation, $\xi$, its velocity, $v$, and its mass, $m$. The inputs that can be controlled will be the amount of thrust applied, $\delta T$, the amount of braking, $\delta B$, and the angle by which the front wheels are turned, $\delta w$.

    ##### Deriving the Dynamics

    The velocity components in the $x$ and $y$ directions can be simply obtained as vector projections of $v$ onto the coordinate axis using trigonometry:

    $$
    \dot{x} = v \cos(\xi), \quad \dot{y} = v \sin(\xi)
    $$

    We'll also assume that the mass changes as a function of velocity and the throttle, i.e.:

    $$
    \dot{m} = g(v, \delta T)
    $$

    This can be specified more explicitly depending on the properties of the actual car.

    Next we use Newton's Second law, $F = m a = m \dot{v}$, written in terms of the velocity $v$. To keep things a bit general we will assume that the total thrust provided by the car is $T(v, \delta T, \delta B)$, a function of the current velocity, as well as throttle and brake amount. We also assume that the component of $T$ perpendicular to the tire has an equal friction force in the opposite direction to cancel it, leaving the parallel component, $T \cos(\delta w)$ as the net force. In turn, this force has components $T \cos(\delta w) \cos(\delta w)$ in the direction of forward acceleration, $\dot{v}$ and $T \cos(\delta w) \sin(\delta w)$ in the tangential direction. It follows that:

    $$
    m \dot{v} = T \cos^2 (\delta w) - D(v)
    $$

    where the last term is the drag due to air resistance, often approximated with $C_D \rho v^2 S/2$, where $C_D$ is the drag coefficient, $\rho$ is the density of air, $S$ is the area of the surface. We'll keep this as $D(v)$ to keep things general.

    The effect of the tangential force $T \cos(\delta w) \sin(\delta w)$ is slightly more technical to derive using Newton's Law. To keep things relatively simple, we'll use a slightly different argument to obtain an expression for the angular velocity $\dot{\xi}$. Assume that in time $\Delta t$ the base of the car moved $v \Delta t$ in original direction, $\xi$, while the orientation $\xi$ changed by $\Delta \xi$.

    Then, using the law of sines from trigonometry yields:

    $$
    \frac{l}{\sin(180-\delta w)} = \frac{l - v \Delta t}{\sin(\delta w - \Delta \xi)}
    $$

    or after simplification:

    $$
    l \sin(\delta w - \Delta \xi) = l \sin(\delta w) - v \Delta t \sin(\delta w)
    $$

    Note that by the mean value theorem $\sin(\delta w) - \sin(\delta w - \Delta \xi) = \cos(\delta w_*) \Delta \xi$ for some value of $\delta w_*$ between $\delta w - \Delta \xi$ and $\delta w$. Substituting the expression for $\sin(\delta w - \Delta \xi)$ results in:

    $$
    l \sin(\delta w) - l \Delta \xi \cos(\delta w_*) = l \sin(\delta w) - v \Delta t \sin(\delta w)
    $$

    or after simplification:

    $$
    \frac{\Delta \xi}{\Delta t} = \frac{v}{l} \frac{\sin(\delta w)}{\cos(\delta w_*)}
    $$

    Finally, taking the limit as $\Delta t \rightarrow 0$ (and consequently $\delta w_* \rightarrow \delta w$), we have:

    $$
    \frac{d \xi}{dt} = \frac{v}{l} \tan(\delta w)
    $$

    ##### Complete System of Equations

    Let's summarize our derived system of differential equations:

    $$
    \begin{align}
    \dot{v} &= \frac{T(v, \delta T, \delta B) \cos^2 (\delta w) - D(v)}{m} \\
    \dot{\xi} &= \frac{v}{l} \tan(\delta w) \\
    \dot{x} &= v \cos(\xi) \\
    \dot{y} &= v \sin(\xi) \\
    \dot{m} &= g(v, \delta T)
    \end{align}
    $$

    #### Minimum Jerk Trajectories

    To calculate a 5 second minimum jerk lane-change trajectory that takes a car traveling at 5m/s to the lane 4 meters to the left at the position 20 meters ahead we can run:

    ```
    generate_2d_traj '[-20, 0]' '[5, 0]' '[0, 0]' '[0, 4]' '[5, 0]' '[0, 0]' 5 lane_plot
    ```

    Here the arguments specify initial position $[x,y]$, initial velocity $[v_x, v_y]$, initial acceleration $[a_x, a_y]$, final position, final velocity, final acceleration, and the time to perform the maneuver.

    ##### Multiple Trajectory Generation

    In real world trajectory generation oftentimes it is not enough to simply generate one optimal trajectory. In practice, one way to approach motion planning for lane changes or turns is to generate many possible trajectories by varying the final conditions and then selecting the best trajectory based on a more complicated cost function that could include, for example, distance to collisions, distance to the center of the lane, fuel consumption, etc.

    Running the command:
    ```
    generate_2d_traj '[-20, 0]' '[5, 0]' '[0, 0]' '[0, 4]' '[5, 0]' '[0, 0]' 5 lane_plot 1000 True 20
    ```

    generates 20 trajectories by varying the final velocities and positions, and chooses the best path based on ensuring forward direction of motion and jerk minimization. The additional parameters above specify number of grid points (1000), a flag that specifies that many trajectories should be sampled (True), and the number of trajectories to sample.

    !!! info "Implementation"
        My implementation of these solvers can be found here: [C++ Code](https://github.com/gurgentus/ccst/blob/master/nums/Car.cpp)

        The BVP solver is generic enough to handle not just the Euler-Lagrange equations corresponding to jerk minimization, but analogous functionals with arbitrary high derivatives and arbitrary number of waypoints.

        For a more general collocation based BVP solver see: [C++ Code](https://github.com/gurgentus/ccst/blob/master/nums/CollocationSolver.cpp)

    #### Optimal Stopping Control

    To calculate the optimal control history to bring a car traveling at 20 m/s to a complete stop in 500 m we can run:
    ```
    generate_optimal_stop_traj 20 500 stop_plot
    ```

    #### Dijkstra's Algorithm

    One way to use Dijkstra's algorithm is to represent the map as a grid using an $m$ by $n$ matrix. To avoid entering a large matrix by hand the toolbox allows to upload any image whose grayscale can be thresholded to produce the obstacles.

    ##### Workflow

    1. **Upload Image**: Expand the menu at the top right corner, above the console screen. Give a name to this image, for example `map1`. This will be the handle for working with the image from the console.

    2. **Display Image**: After uploading the file we can display the uploaded image with `gdisplay map1`.

    3. **Generate Grid**: To generate a grid by thresholding grayscale values of the image we can use:
       ```
       generate_grid map1 15 15
       ```
       where `map1` is the handle of the uploaded image and the last two parameters specify the height and width of the grid. The matrix representing the grid will be saved under `map1_grid` name with values at each cell representing the grayscale value of the image.

    4. **Create Obstacles**: Entering `gdisplay map1_grid` displays this matrix. To turn these values into free space and obstacle regions needed to run Dijkstra's algorithm we can enter:
       ```
       generate_grid_obstacles map1_grid 2 map2_grid
       ```
       This sets cells with value larger than 2 to 1 (representing obstacle region) and cells with values less than or equal to 2 to 0 (representing free space). We can display the resulting matrix with `gdisplay map2_grid`.

    5. **Run Dijkstra's**: Finally, running the following finds a path from the (11,0) position on the grid to the (8,6) position:
       ```
       dijkstras map2_grid [11,0] [8,6] map_result
       ```

=== "Orb. Mech."

    ### Orbital Mechanics Toolbox

    The toolbox uses C++ code under the hood for performance.

    #### Lambert's Problem

    Consider a satellite to be located at $r_1 = 5000 \hat{I} + 10000 \hat{J} + 2100 \hat{K}$ km. We want to design a trajectory that will put the satellite at $r_2 = -14600 \hat{I} + 2500 \hat{J} + 7000 \hat{K}$ km after one hour. This is achieved by solving Lambert's problem, by calling:

    ```
    lambert '[5000, 10000, 2100]' '[-14600, 2500, 7000]' 3600 True 398600 orbit1
    ```

    Here we specified the two positions, time, whether we want the prograde trajectory, $\mu$, and a name to save the results under. To see the orbital elements associated with the calculated orbit we simply type:

    ```
    gdisplay orbit1
    ```

    #### Optimal Circular Orbit Transfer

    Consider establishing the optimal transfer trajectory to get from a given circular orbit around the earth to the largest radial position in a given amount of time using constant thrust and the thrust angle as the control. This problem can be posed as a classic optimal control problem of finding extrema of a functional of the form:

    $$
    J(\alpha) := \int_{t_0}^{t_f} L(t,x(t),\alpha(t)) \, dt + K(t_f, x_f)
    $$

    $$
    \dot{x} = f(t, x, \alpha), \quad x(t_0) = x_0
    $$

    where the running cost $L \equiv 0$ and the terminal cost $K := r(t_f)$ is the final radial position. Precisely:

    $$
    J = r(t_f)
    $$

    subject to the classic two-body equations of motion in polar coordinates:

    $$
    \begin{align}
    \dot{r} &= u \\
    \dot{u} &= \frac{v^2}{r} - \frac{\mu}{r^2} + \frac{T \sin \alpha}{m_0 - |\dot{m}|t} \\
    \dot{v} &= -\frac{u v}{r} + \frac{T \cos\alpha}{m_0 - |\dot{m} t|} \\
    \dot{\theta} &= \frac{v}{r}
    \end{align}
    $$

    where $r$ is the radial position of the vehicle, $u$ and $v$ are radial and tangential velocities, $T$ is the thrust applied at the angle of $\alpha$ radians. In addition, $m_0$ is the initial vehicle mass and $\dot{m}$ is the mass flow rate.

    !!! quote "Reference"
        See James M. Longuski, José J. Guzmán, John E. Prussing, *Optimal Control with Aerospace Applications*, Springer-Verlag New York (2014)

    ##### Boundary Value Problem Formulation

    By the use of Pontryagin's Maximum Principle, this problem can be reduced to solving a boundary value problem:

    $$
    \begin{align}
    \frac{d \bar{r}}{d \tau} &= \bar{u} \eta \\
    \frac{d \bar{u}}{d \tau} &= \left( \frac{\bar{v}^2}{\bar{r}} - \frac{1}{\bar{r}^2}} \right) \eta + \frac{\bar{T}}{m_0 - |\dot{m}| \tau t_f} \left( \frac{p_u}{\sqrt{p_u^2+p_{v}^2}} \right) \\
    \frac{d \bar{v}}{d \tau} &= -\frac{\bar{u}\bar{v}}{\bar{r}}\eta + \frac{\bar{T}}{m_0 - |\dot{m}| \tau t_f} \left( \frac{p_{v}}{\sqrt{p_u^2+p_{v}^2}} \right) \\
    \frac{d \theta}{d \tau} &= \frac{\bar{v}}{\bar{r}} \eta \\
    \frac{d p_r}{d \tau} &= p_u \left(\frac{\bar{v}^2}{\bar{r}^2} -\frac{2}{\bar{r}^3} \right) \eta - p_{v} \frac{\bar{u}\bar{v}}{\bar{r}^2} \eta + \frac{p_{\theta} \bar{v}}{\bar{r}^2} \eta \\
    \frac{d p_u}{d \tau} &= -p_r \eta + \frac{p_{v} \bar{v}}{\bar{r}} \\
    \frac{d p_v}{d \tau} &= -\frac{2 p_u v \eta}{\bar{r}} + \frac{p_{v} u \eta}{\bar{r}} - \frac{p_{\theta} \eta}{\bar{r}}
    \end{align}
    $$

    for the rescaled variables:

    $$
    \bar{r} = \frac{r}{r(0)}, \quad \bar{u} = \frac{u}{v(0)}, \quad \bar{v} = \frac{v}{v(0)}, \quad \tau = \frac{t}{t_f}
    $$

    the co-states $p_r, p_{\theta}, p_u, p_v$ and subject to the boundary conditions:

    $$
    \begin{cases}
    \bar{r}(0) = 1, \quad \bar{u}(0) = 0, \quad \bar{v}(0)=1, \quad \theta(0) = 0 \\
    \bar{u}(1) = 0, \quad \bar{v}(1) = \sqrt{1/\bar{r}(1)}, \quad 1 - p_r(1) + \frac{1}{2} p_v(1) \sqrt{1/\bar{r}^3(1)} = 0, \quad p_{\theta}(1) = 0
    \end{cases}
    $$

    ##### Numerical Solution

    To solve the problem with:

    - $\mu = 3.986004418 \times 10^5$ km³/s²
    - Initial mass $m_0 = 1500$ kg
    - Specific impulse $I_{sp} = 6000$ s
    - Thrust $T = 20$ N
    - Initial orbit radius $6678$ km
    - Final time $t_f = 0.5$ days
    - Using 5 hour timesteps and 500 grid points for each timestep

    we run:

    ```
    orb_transfer_lobatto3 3.986004418e5 1500 6000 20 6678 0.5 5 500 traj_plot
    ```

    The above solves the problem using a three stage Lobatto collocation scheme:

    $$
    \begin{array}{c|ccc}
    0 & 0 & 0 & 0 \\
    1/2 & 5/24 & 1/3 & -1/24 \\
    1 & 1/6 & 2/3 & 1/6 \\
    \hline
      & 1/6 & 2/3 & 1/6
    \end{array}
    $$

    Similarly, we can run a generic collocation code by specifying the scheme at the end of the command. For example, to use a trapezoid scheme:

    $$
    \begin{array}{c|cc}
    0 & 0 & 0 \\
    1 & 1/2 & 1/2 \\
    \hline
      & 1/2 & 1/2
    \end{array}
    $$

    we can enter:

    ```
    orb_transfer 3.986004418e5 1500 6000 20 6678 0.5 5 500 2 [0,1] [[0,0],[0.5,0.5]] [0.5,0.5] traj_plot
    ```

    !!! info "Implementation"
        My implementation of this boundary value problem solver can be found here: [C++ Code](https://github.com/gurgentus/ccst/blob/master/nums/CollocationSolver.cpp)

    The resulting plots can be displayed with:
    ```
    gdisplay traj_plot
    gdisplay traj_plot_control
    ```

=== "Semantic Segm."

    ### Semantic Segmentation

    !!! warning "Coming Soon"
        Semantic segmentation instructions will be added soon.

    #### Uploading an Image

    The first step is to upload an image to be analyzed. To do that expand the menu at the top right corner, above the console screen and upload an image. Give a name to this image, for example `image1`. This will be the handle for working with the image from the console.

    After uploading the file we can display the uploaded image with `gdisplay image1`.

<div id="interactive-toolbox-section">

<h2>Interactive Toolbox</h2>

<iframe src="https://ccst-phi.vercel.app/" width="100%" height="800" frameborder="0" style="border: 1px solid #ddd; border-radius: 4px;" allowfullscreen></iframe>

</div>
