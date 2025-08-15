# 🌌 Black-Hole — OpenGL Simulation

A captivating C++ OpenGL project that leverages GLEW, GLFW, and GLM to create and manipulate rich 3D visuals — driven by precise mathematics, powerful matrix transformations, and high-resolution timing. Designed for anyone exploring the art of graphics programming, real-time rendering, and interactive 3D experiences

---

## 🚀 Features
- **Modern OpenGL Rendering** — using GLEW for OpenGL extensions
- **Cross-Platform Window Handling** with GLFW
- **3D Transformations & Camera** using GLM
- **High-Precision Timing** with `std::chrono`
- **Interactive Controls** (future: add keyboard/mouse inputs)
- **Mathematical Constants & Utilities** for accurate simulations

---

## 📦 Dependencies

Make sure you have the following libraries installed:

- [GLEW](http://glew.sourceforge.net/) — OpenGL Extension Wrangler
- [GLFW](https://www.glfw.org/) — Window creation & input handling
- [GLM](https://github.com/g-truc/glm) — OpenGL Mathematics Library

---

## 🔧 Build Instructions

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/black-hole.git
cd black-hole
````

### **2. Install Dependencies**

Using **vcpkg** (recommended):

```bash
vcpkg install glew:x64-windows glfw3:x64-windows glm:x64-windows
```

### **3. Compile the Project**

Example with `g++`:

```bash
g++ main.cpp -o BlackHole \
    -Ipath/to/include \
    -Lpath/to/lib -lglew32 -lglfw3 -lopengl32
```

On Linux:

```bash
g++ main.cpp -o BlackHole \
    -lGLEW -lglfw -lGL -lm
```

---

## 🎮 Controls (Planned)

| Key     | Action      |
| ------- | ----------- |
| W/A/S/D | Move camera |
| Mouse   | Rotate view |
| Scroll  | Zoom in/out |
| ESC     | Exit        |

---

## 🧠 Technical Highlights

* Uses `glm::mat4` and transformation pipelines for **rotations**, **scaling**, and **translations**.
* Leverages `std::chrono::high_resolution_clock` for smooth **frame timing**.
* Implements **`M_PI` constants** for precise trigonometric calculations.
* Modular code structure for easy feature expansion.

---

## 📸 Preview

*(Screenshot/GIF placeholder — to be added once rendering is done)*

---

## 🤝 Contributing

Pull requests are welcome! If you have feature ideas, feel free to open an issue.

---

## 📜 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

