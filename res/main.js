// Generated by CoffeeScript 1.12.7
var L, animate, c_camera, camera, car, carpaint_mat, controls, create_evironment, environment, init, material, mesh, onWindowResize, render, renderer, rnd, scene, setupControls, shader_loader, sky, sphere_mesh, stats;

camera = void 0;

c_camera = void 0;

scene = void 0;

renderer = void 0;

mesh = void 0;

material = void 0;

sky = void 0;

controls = void 0;

stats = void 0;

car = void 0;

carpaint_mat = void 0;

sphere_mesh = void 0;

L = 1800;

shader_loader = function(vertex_url, fragment_url, onLoad, onProgress, onError) {
  var vertex_loader;
  vertex_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
  vertex_loader.setResponseType('text');
  return vertex_loader.load(vertex_url, (function(vertex_text) {
    var fragment_loader;
    fragment_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    fragment_loader.setResponseType('text');
    return fragment_loader.load(fragment_url, function(fragment_text) {
      return onLoad(vertex_text, fragment_text);
    });
  }), onProgress, onError);
};

rnd = function(r) {
  return (Math.random() - Math.random()) * r / 2.0;
};

environment = [];

create_evironment = function() {
  var f, i, j, materials, plane, results, textureLoader, white_mat;
  textureLoader = new THREE.TextureLoader;
  materials = (function() {
    var j, results;
    results = [];
    for (i = j = 1; j <= 4; i = ++j) {
      results.push(new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: textureLoader.load("res/txt" + i + ".jpg")
      }));
    }
    return results;
  })();
  white_mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });
  results = [];
  for (f = j = 0; j <= 10; f = ++j) {
    switch (f % 3) {
      case 0:
        plane = new THREE.Mesh(new THREE.PlaneGeometry(800, 600, 1, 1), materials[f % 4]);
        plane.position.set(rnd(L), 300, 200 + rnd(100));
        plane.rotateX(Math.PI);
        break;
      case 1:
        plane = new THREE.Mesh(new THREE.PlaneGeometry(800, 600, 1, 1), materials[f % 4]);
        plane.position.set(rnd(L), 300, -200 + rnd(100));
        break;
      case 2:
        plane = new THREE.Mesh(new THREE.CircleGeometry(20 + rnd(50), 16), white_mat);
        plane.rotateX(Math.PI / 2.0);
        plane.position.set(rnd(L), 200 + rnd(100), rnd(800));
    }
    plane.visible = false;
    scene.add(plane);
    results.push(environment.push(plane));
  }
  return results;
};

init = function() {
  var cube_mat, cube_shader, directionalLight, light, normalMap, skymaterial, skyshader, sphere_mat, uniforms;
  renderer = new THREE.WebGLRenderer;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene;
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
  camera.position.z = 500;
  c_camera = new THREE.CubeCamera(1, 1000, 256);
  c_camera.rotateY(Math.PI);
  c_camera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
  scene.add(c_camera);
  skyshader = THREE.ShaderLib['cube'];
  skyshader.uniforms['tCube'].value = c_camera.renderTarget.texture;
  skymaterial = new THREE.ShaderMaterial({
    fragmentShader: skyshader.fragmentShader,
    vertexShader: skyshader.vertexShader,
    uniforms: skyshader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });
  sky = new THREE.Mesh(new THREE.BoxGeometry(400, 400, 400), skymaterial);
  sky.visible = false;
  scene.add(sky);
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  normalMap = THREE.ImageUtils.loadTexture('res/car_normal.png', null, function(something) {
    return render();
  });
  uniforms = {
    paintColor1: {
      type: 'c',
      value: new THREE.Color(0x002f66)
    },
    paintColor2: {
      type: 'c',
      value: new THREE.Color(0x002c99)
    },
    paintColor3: {
      type: 'c',
      value: new THREE.Color(0x276296)
    },
    normalMap: {
      type: 't',
      value: normalMap
    },
    normalScale: {
      type: 'f',
      value: 0.0,
      min: 0.0,
      max: 1.0
    },
    glossLevel: {
      type: 'f',
      value: 1.0,
      min: 0.0,
      max: 5.0
    },
    brightnessFactor: {
      type: 'f',
      value: 1.0,
      min: 0.0,
      max: 1.0
    },
    envMap: {
      type: 't',
      value: c_camera.renderTarget.texture
    },
    microflakeNMap: {
      type: 't',
      value: THREE.ImageUtils.loadTexture('res/SparkleNoiseMap.png')
    },
    flakeColor: {
      type: 'c',
      value: new THREE.Color(0xFFFFFF)
    },
    flakeScale: {
      type: 'f',
      value: -30.0,
      min: -50.0,
      max: 1.0
    },
    normalPerturbation: {
      type: 'f',
      value: 1.0,
      min: -1.0,
      max: 1.0
    },
    microflakePerturbationA: {
      type: 'f',
      value: 0.1,
      min: -1.0,
      max: 1.0
    },
    microflakePerturbation: {
      type: 'f',
      value: 0.48,
      min: 0.0,
      max: 1.0
    }
  };
  uniforms.microflakeNMap.value.wrapS = uniforms.microflakeNMap.value.wrapT = THREE.RepeatWrapping;
  shader_loader('res/carpaint.vert', 'res/carpaint.frag', function(vert, frag) {
    var loader;
    carpaint_mat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      side: THREE.DoubleSide,
      derivatives: true
    });
    loader = new THREE.OBJLoader;
    return loader.load('res/bmw.obj', function(object) {
      car = object.children[0];
      car.material = carpaint_mat;
      scene.add(car);
      return render();
    });
  });
  light = new THREE.AmbientLight(0x404040);
  scene.add(light);
  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);
  cube_shader = THREE.ShaderLib["cube"];
  cube_mat = new THREE.ShaderMaterial({
    fragmentShader: cube_shader.fragmentShader,
    vertexShader: cube_shader.vertexShader,
    uniforms: cube_shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });
  cube_mat.uniforms["tCube"].value = c_camera.renderTarget.texture;
  sphere_mat = new THREE.MeshBasicMaterial({
    envMap: c_camera.renderTarget.texture
  });
  sphere_mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(30.0, 48, 24), sphere_mat);
  sphere_mesh.position.z = -100;
  scene.add(sphere_mesh);
  create_evironment();
  stats = new Stats;
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  document.body.appendChild(stats.domElement);
  setupControls(uniforms);
  return window.addEventListener('resize', onWindowResize, false);
};

onWindowResize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
  return render();
};

animate = function() {
  var e, j, len;
  for (j = 0, len = environment.length; j < len; j++) {
    e = environment[j];
    e.position.x += 10.0;
    if (e.position.x > L / 2.0) {
      e.position.x = -L / 2.0;
    }
  }
  requestAnimationFrame(animate);
  controls.update();
  return render();
};

render = function() {
  var e, j, k, len, len1;
  car.visible = false;
  sphere_mesh.visible = false;
  for (j = 0, len = environment.length; j < len; j++) {
    e = environment[j];
    e.visible = true;
  }
  c_camera.update(renderer, scene);
  carpaint_mat.envMap = c_camera.renderTarget.texture;
  car.visible = true;
  sphere_mesh.visible = true;
  for (k = 0, len1 = environment.length; k < len1; k++) {
    e = environment[k];
    e.visible = false;
  }
  renderer.render(scene, camera);
  return stats.update();
};

setupControls = function(ob) {
  var butob, controller, gui, key, sceneFolder, sourceFolder, uniformsFolder;
  gui = new dat.GUI;
  sceneFolder = gui.addFolder('Scene');
  sceneFolder.add(sky, 'visible').name('Show Cubemap').onChange(function() {
    return render();
  });
  sceneFolder.open();
  uniformsFolder = gui.addFolder('Uniforms');
  for (key in ob) {
    if (ob[key].type === 'f') {
      controller = uniformsFolder.add(ob[key], 'value').name(key);
      if (typeof ob[key].min !== 'undefined') {
        controller = controller.min(ob[key].min).name(key);
      }
      if (typeof ob[key].max !== 'undefined') {
        controller = controller.max(ob[key].max).name(key);
      }
      controller.onChange(function(value) {
        this.object.value = parseFloat(value);
        return render();
      });
    } else if (ob[key].type === 'c') {
      ob[key].guivalue = [ob[key].value.r * 255, ob[key].value.g * 255, ob[key].value.b * 255];
      controller = uniformsFolder.addColor(ob[key], 'guivalue').name(key);
      controller.onChange(function(value) {
        this.object.value.setRGB(value[0] / 255, value[1] / 255, value[2] / 255);
        return render();
      });
    }
  }
  uniformsFolder.open();
  sourceFolder = gui.addFolder('Source');
  butob = {
    'view vertex shader code': function() {
      TINY.box.show;
      return {
        html: '<div style="width: 500px; height: 500px;"><h3 style="margin: 0px; padding-bottom: 5px;">Vertex Shader</h3><pre style="overflow: scroll; height: 470px;">' + document.getElementById('vertexShader').text + '</pre></div>',
        animate: false,
        close: false,
        top: 5
      };
    },
    'view fragment shader code': function() {
      TINY.box.show;
      return {
        html: '<div style="width: 500px; height: 500px;"><h3 style="margin: 0px; padding-bottom: 5px;">Fragment Shader</h3><pre style="overflow: scroll; height: 470px;">' + document.getElementById('fragmentShader').text + '</pre></div>',
        animate: false,
        close: false,
        top: 5
      };
    }
  };
  sourceFolder.add(butob, 'view vertex shader code');
  return sourceFolder.add(butob, 'view fragment shader code');
};

init();

animate();
