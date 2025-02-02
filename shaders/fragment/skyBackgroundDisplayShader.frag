#version 300 es
precision highp float;
precision highp sampler2D;
precision highp isampler2D;

in vec2 fragCoord;
in vec2 texCoord;

uniform sampler2D lightTex;

out vec4 fragmentColor;

float map_range(float value, float min1, float max1, float min2, float max2) { return min2 + (value - min1) * (max2 - min2) / (max1 - min1); }

vec3 hsv2rgb(vec3 c)
{
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()
{
  vec2 lightTexCoord = vec2(texCoord.x, min(texCoord.y, 0.995)); // limit virtical sample to top of simulation

  float light = texture(lightTex, lightTexCoord)[0];

  // vec3 topBackgroundCol = vec3(0.0, 0.0, 0.0);      // 0.15 dark blue
  // vec3 bottemBackgroundCol = vec3(0.20, 0.66, 1.0); // vec3(0.35, 0.58, 0.80) milky white blue
  // vec3 bottemBackgroundCol = vec3(0.40, 0.76, 1.0); // vec3(0.35, 0.58, 0.80) milky white blue

  // vec3 mixedCol = mix(bottemBackgroundCol, topBackgroundCol, clamp(pow(texCoord.y * 0.35, 0.5), 0., 1.)); // 0.2

  // vec3 mixedCol = mix(bottemBackgroundCol, topBackgroundCol, clamp(texCoord.y, 0., 1.)); // 0.2


  float hue = 0.6;
  float sat = map_range(texCoord.y, 0., 2.5, 0.5, 1.0);
  float val = pow(map_range(texCoord.y, 0., 2.5, 1.0, 0.1), 3.0); // pow 3 map 1.0 to 0.3
  val = pow(val, 1. / 2.2);                                       // gamma correction
  vec3 mixedCol = hsv2rgb(vec3(hue, sat, val));


  // if (texCoord.y > 2.49 && texCoord.x > 0.5) // show top
  //   mixedCol.r = 1.;


  fragmentColor = vec4(mixedCol * (light * 0.7 + 0.3), 1.0);

  // fragmentColor = vec4(bottemBackgroundCol, 1.0);
}