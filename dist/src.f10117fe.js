// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/Render.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Render =
/** @class */
function () {
  function Render(width, height) {
    if (width === void 0) {
      width = window.innerWidth;
    }

    if (height === void 0) {
      height = window.innerHeight;
    }

    this.entities = [];
    this.clearColor = "#4f9bd9";
    this.lastUpdate = Date.now();
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
  }

  Render.prototype.add = function (entiti) {
    this.entities.push(entiti);
  };

  Render.prototype.render = function () {
    var _this = this;

    var now = Date.now();
    var dt = now - this.lastUpdate;
    this.lastUpdate = now;
    this.clear();
    this.drawFPS(dt);
    this.entities.forEach(function (entiti) {
      entiti.render(_this.context);
      entiti.update(_this.entities, dt);
    });
    this.update(this);
  };

  Render.prototype.init = function () {
    if (document.readyState === "complete") {
      this.loadCanvas();
    } else {
      window.onload = this.loadCanvas.bind(this);
    }
  };

  Render.prototype.clear = function () {
    this.context.fillStyle = this.clearColor;
    this.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  };

  Render.prototype.drawFPS = function (dt) {
    this.context.fillStyle = "white";
    this.context.font = "30px Arial";
    this.context.fillText("FPS: " + Math.round(1000 / dt), 50, 50);
  };

  Render.prototype.loadCanvas = function () {
    document.body.appendChild(this.canvas);
    setInterval(this.render.bind(this), 0);
  };

  Render.prototype.update = function (render) {
    return;
  };

  return Render;
}();

exports.default = Render;
},{}],"src/Vector.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector =
/** @class */
function () {
  function Vector(x, y) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    this.x = x;
    this.y = y;
  }

  Vector.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
  };

  Vector.prototype.sub = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  };

  Vector.prototype.normalized = function () {
    return Vector.mult(1 / this.mag(), this);
  };

  Vector.prototype.normalize = function () {
    this.mult(1 / this.mag());
  };

  Vector.prototype.mag = function () {
    return Math.hypot(this.x, this.y);
  };

  Vector.prototype.mult = function (s) {
    this.x *= s;
    this.y *= s;
  };

  Vector.prototype.copy = function () {
    return new Vector(this.x, this.y);
  };

  Vector.mult = function (s, v) {
    return new Vector(v.x * s, v.y * s);
  };

  Vector.add = function (v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  };

  Vector.sub = function (v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  };

  return Vector;
}();

exports.default = Vector;
},{}],"src/Circle.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector_1 = __importDefault(require("./Vector"));

var Circle =
/** @class */
function () {
  function Circle(position, radius) {
    this.position = position;
    this.radius = radius;
  }

  Circle.prototype.collides = function (other) {
    var distanceVector = Vector_1.default.sub(this.position, other.position);
    var distance = distanceVector.mag();

    if (distance <= this.radius + other.radius) {
      return true;
    }

    return false;
  };

  return Circle;
}();

exports.default = Circle;
},{"./Vector":"src/Vector.ts"}],"src/Body.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector_1 = __importDefault(require("./Vector"));

var Circle_1 = __importDefault(require("./Circle")); // COEFICIENTE_RESTITUCION


var CR = 0.99;
var id = 0; //!

var IMPULSE_MAG = 1;

var Body =
/** @class */
function (_super) {
  __extends(Body, _super);

  function Body(position, radius) {
    var _this = _super.call(this, position, radius) || this;

    _this.friction = 1;
    id++; //!

    _this.id = id;
    _this.velocity = new Vector_1.default();
    _this.acceleration = new Vector_1.default();
    _this.mass = Math.PI * _this.radius * _this.radius;
    return _this;
  }

  Body.prototype.fixPosition = function (other) {
    var distance = Vector_1.default.sub(this.position, other.position);
    var overlap = this.radius + other.radius - distance.mag();
    var fix = Vector_1.default.mult(overlap / 2, distance.normalized());
    this.position.add(fix);
    other.position.add(Vector_1.default.mult(-1, fix));
  };

  Body.prototype.updateCollisions = function (Entitys) {
    var _this = this;

    Entitys.forEach(function (Entity) {
      if (_this.id !== Entity.id) {
        if (_this.collides(Entity)) {
          var _a = _this.velocityAfterCollision(Entity),
              v1 = _a[0],
              v2 = _a[1];

          _this.velocity = v1;
          Entity.velocity = v2;

          _this.fixPosition(Entity);
        }
      }
    });
  };

  Body.prototype.velocityAfterCollision = function (other) {
    //if (Vector.sub(this.position, other.position).mag() > 1) {
    var v1 = Vector_1.default.mult(1 / (this.mass + other.mass), Vector_1.default.add(Vector_1.default.add(Vector_1.default.mult(CR * other.mass, Vector_1.default.sub(other.velocity, this.velocity)), Vector_1.default.mult(this.mass, this.velocity)), Vector_1.default.mult(other.mass, other.velocity)));
    var v2 = Vector_1.default.mult(1 / (this.mass + other.mass), Vector_1.default.add(Vector_1.default.add(Vector_1.default.mult(CR * this.mass, Vector_1.default.sub(this.velocity, other.velocity)), Vector_1.default.mult(this.mass, this.velocity)), Vector_1.default.mult(other.mass, other.velocity)));
    return [v1, v2]; //}
    //return [this.position.copy(), other.position.copy()];
  };

  Body.prototype.updatePhysics = function (dt) {
    var dtInSeconds = dt / 1000;
    this.position.add(Vector_1.default.mult(dtInSeconds, this.velocity));
    this.velocity.add(Vector_1.default.mult(dtInSeconds, this.acceleration));
    this.velocity.mult(dtInSeconds * this.friction);
    this.acceleration.mult(0);
  };

  Body.prototype.addForce = function (force) {
    this.acceleration.add(Vector_1.default.mult(1 / this.mass, force));
  };

  return Body;
}(Circle_1.default);

exports.default = Body; // this.addForce(Vector.mult(IMPULSE_MAG, dist));
// other.addForce(Vector.mult(IMPULSE_MAG, dist));
},{"./Vector":"src/Vector.ts","./Circle":"src/Circle.ts"}],"rock.png":[function(require,module,exports) {
module.exports = "/rock.2683b323.png";
},{}],"src/Entity.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Body_1 = __importDefault(require("./Body"));

var rock_png_1 = __importDefault(require("../rock.png"));

var FIX_POS = 2;
var VEL_AFTER_COLLISION = 0.5;
var img = document.createElement('img');
img.src = rock_png_1.default;

img.onload = function () {
  console.log("IMG: LOADED CORRECTLY");
  console.log(img);
};

var Entity =
/** @class */
function (_super) {
  __extends(Entity, _super);

  function Entity(radius, position) {
    var _this = _super.call(this, position, radius) || this;

    _this.color = "#00FF00";
    _this.position = position;
    return _this;
  }

  Entity.prototype.update = function (Entitys, dt) {
    // this.updateCollisions(Entitys);
    this.updatePhysics(dt);
    this.maintainInsideFrame();
  };

  Entity.prototype.maintainInsideFrame = function (width, height) {
    if (width === void 0) {
      width = window.innerWidth;
    }

    if (height === void 0) {
      height = window.innerHeight;
    }

    var fix = FIX_POS + this.radius;

    if (this.position.x - this.radius < 0) {
      this.velocity.x *= -VEL_AFTER_COLLISION;
      this.position.x = fix;
    }

    if (this.position.x + this.radius > width) {
      this.velocity.x *= -VEL_AFTER_COLLISION;
      this.position.x = width - fix;
    }

    if (this.position.y - this.radius < 0) {
      this.velocity.y *= -VEL_AFTER_COLLISION;
      this.position.y = fix;
    }

    if (this.position.y + this.radius > height) {
      this.velocity.y *= -VEL_AFTER_COLLISION;
      this.position.y = height - fix;
    }
  };

  Entity.prototype.render = function (context) {
    context.beginPath();
    context.strokeStyle = this.color; // context.fillStyle = "#DDD";// this.color;

    context.drawImage(img, this.position.x - this.radius, this.position.y - this.radius, 2 * this.radius, 2 * this.radius); // context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

    context.stroke(); // context.fill();
  };

  return Entity;
}(Body_1.default);

exports.default = Entity;
},{"./Body":"src/Body.ts","../rock.png":"rock.png"}],"src/Rect.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Rect =
/** @class */
function () {
  function Rect(position, w, h) {
    this.w = w;
    this.h = h;
    this.position = position;
  }

  Rect.prototype.render = function (context) {
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.w, this.h);
    context.stroke();
  };

  Object.defineProperty(Rect.prototype, "x", {
    get: function get() {
      return this.position.x;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Rect.prototype, "y", {
    get: function get() {
      return this.position.y;
    },
    enumerable: true,
    configurable: true
  });

  Rect.prototype.collidesRect = function (rect) {
    if (this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.y) {
      return true;
    }

    return false;
  };

  Rect.prototype.containsCircle = function (circle) {
    var distX = Math.abs(circle.position.x - this.position.x - this.w / 2);
    var distY = Math.abs(circle.position.y - this.position.y - this.h / 2);
    if (distX > this.w / 2 + circle.radius) return false;
    if (distY > this.h / 2 + circle.radius) return false;
    if (distX <= this.w / 2) return true;
    if (distY <= this.h / 2) return true;
    var dx = distX - this.w / 2;
    var dy = distY - this.h / 2;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  };

  return Rect;
}();

exports.default = Rect;
},{}],"src/Quadtree.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Rect_1 = __importDefault(require("./Rect"));

var Vector_1 = __importDefault(require("./Vector"));

var QuadTree =
/** @class */
function () {
  function QuadTree(border, capacity) {
    if (capacity === void 0) {
      capacity = 10;
    }

    this.divided = false;
    this.childs = [];
    this.subTrees = [];
    this.border = border;
    this.capacity = capacity;
  }

  QuadTree.prototype.subdivide = function () {
    var offsetX = Vector_1.default.add(new Vector_1.default(this.border.w / 2, 0), this.border.position);
    var offsetY = Vector_1.default.add(new Vector_1.default(0, this.border.h / 2), this.border.position);
    var offsetXY = Vector_1.default.add(new Vector_1.default(this.border.w / 2, this.border.h / 2), this.border.position);
    this.subTrees.push(new QuadTree(new Rect_1.default(this.border.position.copy(), this.border.w / 2, this.border.h / 2), this.capacity), new QuadTree(new Rect_1.default(offsetX, this.border.w / 2, this.border.h / 2), this.capacity), new QuadTree(new Rect_1.default(offsetY, this.border.w / 2, this.border.h / 2), this.capacity), new QuadTree(new Rect_1.default(offsetXY, this.border.w / 2, this.border.h / 2), this.capacity));
    this.divided = true;
  };

  QuadTree.prototype.queryRange = function (range) {
    var found = [];

    if (this.border.containsCircle(range)) {
      this.childs.forEach(function (child) {
        if (range.collides(child)) found.push(child);
      });

      if (this.divided) {
        this.subTrees.forEach(function (tree) {
          found.push.apply(found, tree.queryRange(range));
        });
      }
    }

    return found;
  };

  QuadTree.prototype.queryRect = function (range) {
    var found = [];

    if (this.border.collidesRect(range)) {
      this.childs.forEach(function (child) {
        if (range.containsCircle(child)) found.push(child);
      });

      if (this.divided) {
        this.subTrees.forEach(function (tree) {
          found.push.apply(found, tree.queryRect(range));
        });
      }
    }

    return found;
  };

  QuadTree.prototype.insert = function (Entity) {
    if (this.border.containsCircle(Entity)) {
      if (this.childs.length < this.capacity) {
        this.childs.push(Entity);
        return true;
      } else {
        if (!this.divided) {
          this.subdivide();
        }

        this.subTrees.find(function (tree) {
          return tree.insert(Entity);
        });
        return true;
      }
    }
  };

  QuadTree.prototype.draw = function (context) {
    context.strokeStyle = "#FFFFFF";
    context.strokeRect(this.border.position.x, this.border.position.y, this.border.w, this.border.h);
    this.subTrees.forEach(function (tree) {
      return tree.draw(context);
    });
  };

  return QuadTree;
}();

exports.default = QuadTree;
},{"./Rect":"src/Rect.ts","./Vector":"src/Vector.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Render_1 = __importDefault(require("./Render"));

var Entity_1 = __importDefault(require("./Entity"));

var Vector_1 = __importDefault(require("./Vector"));

var Quadtree_1 = __importDefault(require("./Quadtree"));

var Rect_1 = __importDefault(require("./Rect"));

var NUMBER_OF_BALLS = 500;
var COLLISION_SEARCH_AREA = 30;
var ATTRACTION_FORCE_TO_MOUSE = 100000000000;
var quadtreeMode = true;
var attractionMouse = false;
var showQuadtreeMode = true;
var mousePosition = new Vector_1.default();
var render = new Render_1.default();
var entityFollowMouse = new Entity_1.default(50, new Vector_1.default(500, 500));
render.add(entityFollowMouse);

var _loop_1 = function _loop_1() {
  var entitySize = 10 + Math.random() * 10;
  var entityPosition = new Vector_1.default(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
  var entity = new Entity_1.default(entitySize, entityPosition);
  var entityCanBeAdded = true; // An entity can be added if it doesn't collide with other entity.

  render.entities.forEach(function (other) {
    if (other.collides(entity)) entityCanBeAdded = false;
  });

  if (entityCanBeAdded) {
    render.add(entity);
  }
}; // * Initialization


while (render.entities.length < NUMBER_OF_BALLS) {
  _loop_1();
}

document.addEventListener("mousemove", function (event) {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
});
document.addEventListener("keydown", function (event) {
  if (event.key.toLocaleLowerCase() === "q") {
    quadtreeMode = !quadtreeMode;
  }

  if (event.key.toLocaleLowerCase() === "a") {
    attractionMouse = !attractionMouse;
  }

  if (event.key.toLocaleLowerCase() === "s") {
    showQuadtreeMode = !showQuadtreeMode;
  }
}); // Add force of attraction between the mouse and the entity.

function addForceEntityToMouse() {
  if (attractionMouse) {
    render.entities.forEach(function (entity) {
      var distanceVector = Vector_1.default.sub(mousePosition, entity.position);
      var distance = distanceVector.mag();

      if (distance > 50) {
        // Does not add forces if the object is too near of the mouse.
        var force = distanceVector.normalized();
        force.mult(ATTRACTION_FORCE_TO_MOUSE / distance);
        entity.addForce(force);
      }
    });
  }
}

render.update = function () {
  var distance = Vector_1.default.sub(mousePosition, entityFollowMouse.position);

  if (distance.mag() > 10) {
    distance.normalize();
    distance.mult(10);
    entityFollowMouse.velocity = distance;
    entityFollowMouse.position.add(distance);
  }

  addForceEntityToMouse();

  if (quadtreeMode) {
    var screenSizeRectangle = new Rect_1.default(new Vector_1.default(), window.innerWidth, window.innerHeight);
    var qt_1 = new Quadtree_1.default(screenSizeRectangle, 5); // Inset all entities in quadtree.

    render.entities.forEach(function (entity) {
      return qt_1.insert(entity);
    });
    render.entities.forEach(function (entity) {
      // Rectangle around the entity.
      var query = generateRectAroundVector(entity.position); // Search all entities inside the rectangle.

      var entitiesInsideRect = qt_1.queryRect(query); // Check collision with all entities inside the rectangle.

      entity.updateCollisions(entitiesInsideRect);
    });

    if (showQuadtreeMode) {
      qt_1.draw(render.context);
    }
  } else {
    render.entities.forEach(function (entity) {
      entity.updateCollisions(render.entities);
    });
  }

  render.context.fillStyle = "white";
  render.context.font = "30px Arial";
  render.context.fillText("Quadtree mode " + (quadtreeMode ? 'ON' : 'OFF') + ".", 50, 100);
  render.context.fillText("show quadtree mode " + (showQuadtreeMode ? 'ON' : 'OFF') + ".", 50, 150);
  render.context.fillText("Attraction mouse mode " + (attractionMouse ? 'ON' : 'OFF') + ".", 50, 200);
  render.context.fillText("NUMBER_OF_BALLS " + NUMBER_OF_BALLS + ".", 50, 250);
};

render.init();

function generateRectAroundVector(v) {
  return new Rect_1.default(Vector_1.default.sub(v, new Vector_1.default(COLLISION_SEARCH_AREA / 2, COLLISION_SEARCH_AREA / 2)), COLLISION_SEARCH_AREA, COLLISION_SEARCH_AREA);
} //    const result = render.entities;
// result.forEach(r => {
//   const distance = Vector.sub(r.position, entity.position);
//   const d = distance.mag();
//   distance.normalize();
//   distance.mult((entity.mass * r.mass) / (d * d));
//   distance.mult(0.005);
//   if (!isNaN(distance.x) || !isNaN(distance.x)) {
//     entity.addForce(distance);
//   }
// })
},{"./Render":"src/Render.ts","./Entity":"src/Entity.ts","./Vector":"src/Vector.ts","./Quadtree":"src/Quadtree.ts","./Rect":"src/Rect.ts"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62765" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map