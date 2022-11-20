import { cos, PI, random_double, sin, sqrt } from "./utils/Constant";
import Vector3 from "./utils/Vector3";

function main() {
  let inside_circle = 0;
  let runs = 0;
  while (true) {
    runs++;
    let x = random_double(-1, 1);
    let y = random_double(-1, 1);
    if (x * x + y * y < 1) inside_circle++;
    if (runs % 1000000 == 0) {
      console.log(((4 * inside_circle) / runs).toFixed(12));
    }
  }
}

// main();

function main2() {
  let inside_circle = 0;
  let inside_circle_stratified = 0;
  let sqrt_N = 10000;
  for (let i = 0; i < sqrt_N; i++) {
    for (let j = 0; j < sqrt_N; j++) {
      let x = random_double(-1, 1);
      let y = random_double(-1, 1);
      if (x * x + y * y < 1) inside_circle++;
      x = 2 * ((i + random_double()) / sqrt_N) - 1;
      y = 2 * ((j + random_double()) / sqrt_N) - 1;
      if (x * x + y * y < 1) inside_circle_stratified++;
    }
  }

  const N = sqrt_N * sqrt_N;
  console.log(
    "Regular    Estimate of Pi = ",
    ((4 * inside_circle) / N).toFixed(12)
  );
  console.log(
    "Stratified Estimate of Pi = ",
    ((4 * inside_circle_stratified) / N).toFixed(12)
  );
}
// main2()

function main3() {
  let e = 0.0;

  const total_N = 100000;
  let less_N = 0;
  for (let i = 0; i < total_N; ++i) {
    e = 0.5 * Math.sqrt(4.0 * random_double(0, 1));
    if (e < 0.25) ++less_N;
  }

  console.log(`less_p = "${less_N / total_N}`); // less_p = 0.06229
}
// main3()

function pdf(x: Vector3) {
  return 1 / (4 * Math.PI);
}

function main4() {
  const N = 100000;
  let sum = 0.0;
  for (let i = 0; i < N; i++) {
    let d = Vector3.random_unit_vector();
    let cosine_squared = d.y * d.y;
    sum += cosine_squared / pdf(d);
    // let x = Math.pow(random_double(0,8), 1/3);
    // sum += x*x / pdf(x);

    // let x = random_double(0,2);
    // sum += x*x / pdf(x);
    // let x = random_double(0,4)
    // sum+= x/pdf(Math.sqrt(x))
  }
  console.log(`I =  ${sum / N} `);
}
// main4();

function main5() {
  const N = 1000000;
  let sum = 0.0;
  for (let i = 0; i < N; i++) {
    let r1 = random_double();
    let r2 = random_double();
    let x = cos(2 * PI * r1) * 2 * sqrt(r2 * (1 - r2));
    let y = sin(2 * PI * r1) * 2 * sqrt(r2 * (1 - r2));
    let z = 1 - r2;
    sum += (z * z * z) / (1.0 / (2.0 * PI));
  }
  console.log(`Pi/2     = ${PI / 2}`);
  console.log(`Estimate = ${sum / N}`);
}
// main5()

function random_cosine_direction() {
  let r1 = random_double();
  let r2 = random_double();
  let z = sqrt(1 - r2);

  let phi = 2 * PI * r1;
  let x = cos(phi) * sqrt(r2);
  let y = sin(phi) * sqrt(r2);

  return new Vector3(x, y, z);
}

function main6() {
  const N = 1000000;

  let sum = 0.0;
  for (let i = 0; i < N; i++) {
    let v = random_cosine_direction();
    sum += (v.z * v.z * v.z) / (v.z / PI);
  }

  console.log(`Pi/2     = ${PI / 2}`);
  console.log(`Estimate = ${sum / N}`);
}
main6();
