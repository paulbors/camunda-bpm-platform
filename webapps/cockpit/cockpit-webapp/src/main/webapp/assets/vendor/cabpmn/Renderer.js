/**
 * The BPMN 2.0 SVG renderer module
 *
 * This module provides the functionality for rendering a BPMN 2.0 Process Model using DOJO GFX
 * 
 * @author: Andreas Drobisch
 * @author: Jakob Freund
 * @author: Daniel Meyer
 * 
 */

define(["dojox/gfx", "dojo/_base/lang", "dojo/dom-construct", "dojo/_base/window", "dojo/query", "dojo/dom", "dojo/dom-class"], function (gfx, lang, domConstruct, win, query, dom, domClass) {
  // constructor
  function BpmnElementRenderer(baseElement) {

    if(!baseElement) {
      throw new RenderingException("Base element cannot be null");
    }

    // the bpmn base element to be rendered
    this.baseElement = baseElement;
  };

  var eventDefinitionPaths = {
    "messagecatch": "m 0.7,0.18618099 8,5.99999991 8,-5.99999991 z m 0,0.99999991 0,10.0000021 16,0 0,-10.0000021 -8,6 z",
    "messagethrow": "m 0.7,0.18618099 8,5.99999991 8,-5.99999991 z m 0,0.99999991 0,10.0000021 16,0 0,-10.0000021 -8,6 z",
    "timerEventDefinition":"m 5.7098215,0.07589285 c -5.99031189,0 -10.84375,4.85343775 -10.84375,10.84375015 0,5.990311 4.85343811,10.875 10.84375,10.875 5.9903115,0 10.8749995,-4.884689 10.8749995,-10.875 0,-5.9903125 -4.884688,-10.84375015 -10.8749995,-10.84375015 z m 0,1.00000005 c 5.4498715,0 9.8749995,4.3938778 9.8749995,9.8437501 0,5.449871 -4.425128,9.875 -9.8749995,9.875 -5.44987165,0 -9.84375,-4.425129 -9.84375,-9.875 0,-5.4498724 4.39387835,-9.8437501 9.84375,-9.8437501 z m -0.5,0 0,3 1,0 0,-3 -1,0 z m -4.0625001,0.78125 -0.87499995,0.4375 1.50000005,3 0.875,-0.4375 -1.5000001,-3 z m 9.1249996,0 -1.4999998,3 0.875,0.4375 1.4999998,-3 -0.875,-0.4375 z m -3.0312498,2.0625 -1.9999997,7.0000001 -0.1875,0.65625 0.65625,0 3.9999997,0 0,-1 -3.3124997,0 1.8124997,-6.3750001 -0.96875,-0.28125 z m -10.3124997,1.71875 -0.4375,0.875 2.99999989,1.5 0.43750002,-0.875 -2.99999991,-1.5 z m 17.5624995,0 -3,1.5 0.4375,0.875 3,-1.5 -0.4375,-0.875 z m -18.7812495,4.9375001 0,1 3,0 0,-1 -3,0 z m 16.9999995,0 0,1 3,0 0,-1 -3,0 z m -13.21874961,3.5625 -2.99999989,1.5 0.4375,0.875 2.99999991,-1.5 -0.43750002,-0.875 z m 12.43749961,0 -0.4375,0.875 3,1.5 0.4375,-0.875 -3,-1.5 z m -10.1562495,2.71875 -1.50000005,3 0.87499995,0.4375 1.5000001,-3 -0.875,-0.4375 z m 7.8749997,0 -0.875,0.4375 1.4999998,3 0.875,-0.4375 -1.4999998,-3 z m -4.4374997,1.21875 0,3 1,0 0,-3 -1,0 z",
    "errorEventDefinition": "M 11.463696,4.1000734 8.0101971,17.518491 2.1842371,7.2103904 -2.0184917,13.000178 1.6918061,-0.23912289 7.6390051,9.0612304 11.463696,4.1000734 z",
    "escalationEventDefinition": "m 3.629,-0.1288182 6,15.0000012 -6,-6.7500012 -6,6.7500012 z",
    "signalEventDefinition": "m -3,10.747183 14.620837,0 L 4.3104179,-1.924209 -3,10.747183 z",
    "cancelEventDefinition": "M -3.099,2.5764382 -0.6787673,0.1562061 4.1616964,4.9966705 9.0021612,0.15620559 11.422392,2.5764374 6.5819284,7.416902 11.422393,12.257368 9.0021612,14.677601 4.1616964,9.837136 -0.67876815,14.6776 -3.0989996,12.257367 1.7414641,7.4169029 -3.099,2.5764382 z",
    "conditionalEventDefinition": "m -3.0037595,0.38909773 15.2932325,0 0,15.29323327 -15.2932325,0 0,-15.29323327 m 2.54887227,2.54887217 10.19548863,0 m -10.19548863,3.3984963 10.19548863,0 m -10.19548863,3.3984961 10.19548863,0 m -10.19548863,3.3984967 10.19548863,0 z",
    "compensateEventDefinition": "m 3.1,-0.32181697 0,13.99999997 -7,-7 7,-6.99999997 m 7,0 0,13.99999997 -7,-7 7,-6.99999997 z",
    "multipleParallel": "m -4.075,6.121179 0,6.000004 6.25,0 0,6.75 6,0 0,-6.75 6.75,0 0,-6.000004 -6.75,0 0,-6.24999992 -6,0 0,6.24999992 z",
    "multiple": "M 9.770542,15.081371 -0.30230591,15.080531 -3.414188,5.5004192 4.735411,-0.41957216 12.884022,5.5017792 9.770542,15.081371 z",
    "linkEventDefinition": "m -1.5357143,2.8073706 9,0 0,-2.99999997 5.0000003,4.99999997 -5.0000003,5 0,-3 -10,0 0,-4"
  };

  var taskDefinitionPaths = {
    // Public Domain: http://thenounproject.com/noun/user/#icon-No1331
    "userTask": "M 13.958222,1.3965348 c 0.182747,0.8062061 0.403968,1.6764836 0.446907,2.5155819 0.01134,0.2240793 0.02473,0.518055 -0.06905,0.7092419 0.764998,0.5077757 0.390571,1.5630737 -0.05702,2.0999727 -0.161107,0.192558 -0.527289,0.431713 -0.609044,0.670525 -0.120916,0.351195 -0.270343,0.695879 -0.483663,1.006644 -0.178281,0.259027 -0.140152,0.06304 -0.317747,0.460493 -0.120228,0.539983 -0.302632,1.7628257 -0.04466,2.2647777 0.338701,0.65819 1.080683,1.074827 1.69488,1.424993 0.814119,0.464605 1.723734,0.805521 2.593159,1.151919 0.800379,0.318987 1.635108,0.557115 2.405258,0.947026 0.241488,0.121976 0.485037,0.241211 0.713815,0.386486 0.184465,0.117179 0.493968,0.297744 0.537937,0.534158 v 1.85842 H 0.15494912 l 0.014084,-1.85842 c 0.043969,-0.236071 0.353472,-0.416979 0.5379371,-0.534158 0.2287778,-0.145275 0.47232658,-0.264167 0.71381428,-0.386486 0.7701499,-0.389911 1.6052233,-0.628039 2.4052587,-0.947026 0.8694245,-0.346741 1.7786961,-0.687314 2.5931586,-1.151919 0.613853,-0.350166 1.355835,-0.766803 1.694536,-1.424993 0.25832,-0.502295 0.114046,-1.7302767 -0.0065,-2.2695747 l 0,0 c -0.20645,-0.133282 -0.349007,-0.54615 -0.466144,-0.752755 -0.12332,-0.218255 -0.222594,-0.453641 -0.373052,-0.655792 -0.205076,-0.275817 -0.546868,-0.404988 -0.77015,-0.66333 -0.149083,-0.172 -0.212633,-0.385115 -0.286487,-0.596174 -0.08828,-0.252175 -0.045,-0.457067 -0.0845,-0.740421 -0.01752,-0.121291 0.04466,-0.262112 0.116794,-0.364558 0.08863,-0.126087 0.250075,-0.1507564 0.290953,-0.3104215 0.0505,-0.1976969 -0.0608,-0.429314 -0.0821,-0.6246125 -0.02267,-0.2086611 -0.07695,-0.5413538 -0.07592,-0.7507001 0.0034,-0.7596083 -0.137404,-1.4448662 0.472327,-2.0451523 0.21435,-0.2103742 0.457899,-0.39231013 0.690455,-0.58212663 l 0,0 c 0.08931,-0.2836968 0.51767,-0.4584375 0.768089,-0.5536884 0.325304,-0.1233464 0.667441,-0.1925574 1.000989,-0.2915772 1.0064852,-0.2991151 2.1630842,-0.2672506 3.0455622,0.3525652 0.289579,0.2035216 0.688738,0.028781 0.993775,0.2035216 0.293701,0.1685734 0.644082,0.55814253 0.610418,0.91756033 Z",
    // Public Domain: http://thenounproject.com/noun/gear/#icon-No1329
    //"serviceTask": "M 18.67807,11.927829 c 0.364069,0 0.702787,-0.305785 0.752318,-0.679432 0,0 0.06961,-0.525126 0.06961,-1.149622 0,-0.6244953 -0.06961,-1.1496211 -0.06961,-1.1496211 C 19.380665,8.5753047 19.042139,8.2697218 18.67807,8.2697218 h -1.881379 c -0.364264,0 -0.742568,-0.240548 -0.840458,-0.5344165 -0.09789,-0.2938685 -0.232637,-1.2366713 0.02496,-1.5032736 l 1.329914,-1.3774454 c 0.257402,-0.2668044 0.277292,-0.7220481 0.04407,-1.0118771 L 15.790481,2.2216862 C 15.510653,1.9799263 15.071314,2.0005274 14.813521,2.2673317 L 13.483607,3.6447771 C 13.226205,3.9115815 12.797005,4.0190303 12.530437,3.8837094 12.263675,3.7483885 11.516232,3.1776171 11.516232,2.8003344 V 0.85171369 c 0,-0.37728271 -0.295232,-0.72790518 -0.655987,-0.7794079 C 10.860245,0.07230579 10.35324,0 9.750294,0 9.1473483,0 8.6403431,0.07230579 8.6403431,0.07230579 8.2793944,0.12360654 7.9841614,0.47443098 7.9841614,0.85171369 V 2.8003344 c 0,0.3772827 -0.2320524,0.7689054 -0.5159752,0.8704971 C 7.1842633,3.7722211 6.2741889,3.9117834 6.0165914,3.6449791 L 4.6866778,2.2675337 C 4.4290802,2.0007294 3.9895457,1.9801283 3.7099128,2.2216862 L 2.1450219,3.8425072 C 1.9116045,4.1323363 1.9314947,4.58758 2.1890923,4.8543843 L 3.5188109,6.2318297 C 3.7764085,6.498634 3.8803446,6.9429713 3.7494982,7.2190663 3.6186519,7.4951613 3.0677713,8.2695199 2.7035076,8.2695199 H 0.82232339 c -0.36426372,0 -0.70278717,0.3057848 -0.75251268,0.679432 0,0 -0.06981071,0.5251258 -0.06981071,1.1496211 0,0.624698 0.06981071,1.149622 0.06981071,1.149622 0.0495305,0.373849 0.38824896,0.679432 0.75251268,0.679432 H 2.7037026 c 0.3642637,0 0.7423725,0.240346 0.8402635,0.534417 0.097891,0.293868 0.2326374,1.236469 -0.02496,1.503273 L 2.1892876,15.342561 C 1.93169,15.609365 1.9117998,16.064609 2.1452167,16.354438 l 1.564696,1.621023 C 3.9897405,18.217019 4.42908,18.19662 4.6866776,17.929811 L 6.0165914,16.55237 c 0.2575975,-0.266602 0.686602,-0.374253 0.9533647,-0.238932 0.2667627,0.13532 1.0142053,0.706092 1.0142053,1.083375 v 1.94862 c 0,0.377081 0.295233,0.727905 0.6561817,0.779206 0,0 0.5068102,0.0721 1.1099509,0.0721 0.603141,0 1.109951,-0.0721 1.109951,-0.0721 0.36095,-0.0515 0.655987,-0.402125 0.655987,-0.779206 v -1.94862 c 0,-0.377283 0.232053,-0.769108 0.515976,-0.870497 0.283923,-0.10139 1.193997,-0.24075 1.451594,0.02585 l 1.329719,1.377445 c 0.257598,0.266603 0.697132,0.287204 0.97696,0.04565 l 1.564696,-1.620417 c 0.233222,-0.289829 0.213527,-0.744871 -0.04427,-1.011877 L 15.98119,13.965723 c -0.257597,-0.266804 -0.361534,-0.711141 -0.230687,-0.987438 0.130651,-0.276297 0.681726,-1.050454 1.04599,-1.050454 h 1.881574 z m -8.9279711,1.867226 c -1.9710796,0 -3.5689259,-1.654752 -3.5689259,-3.696482 0,-2.0413251 1.5978463,-3.6964813 3.5689259,-3.6964813 1.9710811,0 3.5689271,1.6549542 3.5689271,3.6964813 0,2.041528 -1.597846,3.696482 -3.5689271,3.696482 Z",
    "serviceTask": "m 20.347,4.895 -2.561,2.56 0.943,2.277 3.624,0 0,3.383 -3.622,0 -0.943,2.277 2.563,2.563 -2.393,2.392 -2.561,-2.561 -2.277,0.943 0,3.624 -3.383,0 0,-3.622 L 7.46,17.788 4.897,20.35 2.506,17.958 5.066,15.397 4.124,13.12 l -3.624,0 0,-3.383 3.621,0 0.944,-2.276 -2.562,-2.563 2.392,-2.392 2.56,2.56 2.277,-0.941 0,-3.625 3.384,0 0,3.621 2.276,0.943 2.562,-2.562 z",
    "scriptTask": "M6.402,0.5H20.902C20.902,0.5,15.069,3.333,15.069,6.083S19.486,12.083,19.486,15.25S15.319,20.333,15.319,20.333H0.235C0.235,20.333,5.235,17.665999999999997,5.235,15.332999999999998S0.6520000000000001,8.582999999999998,0.6520000000000001,6.082999999999998S6.402,0.5,6.402,0.5ZM3.5,4.5L13.5,4.5M3.8,8.5L13.8,8.5M6.3,12.5L16.3,12.5M6.5,16.5L16.5,16.5",
    "receiveTask" : "m 0.9390847,0.90862706 0,12.57129694 20.0406103,0 0,-12.57129694 z m 0,0 L 10.959389,8.4514053 20.979695,0.90862706",
    "sendTask" : "M 0.93908473,0.91877964 8.9390847,6.9187796 16.939085,0.91877964 z m 0,0.99999996 0,10.0000004 16.00000027,0 0,-10.0000004 -8.0000003,6 z",
    "manualTask":  "M0.5,3.751L4.583,0.5009999999999999C4.583,0.5009999999999999,15.749,0.5839999999999999,16.666,0.5839999999999999S14.249,3.5009999999999994,15.166,3.5009999999999994S26.833,3.5009999999999994,27.75,3.5009999999999994C28.916,5.209,27.582,6.667999999999999,26.916,7.167999999999999S27.791,9.084999999999999,25.916,11.584999999999999C25.166,11.834999999999999,26.666,13.459999999999999,24.583000000000002,14.918C23.416,15.501,25.166,16.46,23.333000000000002,17.750999999999998C22.166,17.750999999999998,2.5000000000000036,17.833999999999996,2.5000000000000036,17.833999999999996L0.5000000000000036,16.500999999999998V3.751ZM13.5,7L27,7M13.5,11L26,11M14,14.5L25,14.5M8.2,3.1L15,3.1",
    "businessRuleTask" : "m 0.32589285,0.32077148 0,0.25000003 0,4.46874999 0,0.25 0.25,0 17.03125015,0 0.25,0 0,-0.25 0,-4.46874999 0,-0.25000003 -0.25,0 -17.03125015,0 -0.25,0 z m 0.5,0.50000003 16.53125015,0 0,3.96874999 -16.53125015,0 0,-3.96874999 z m 4.71875005,4.91635739 0,5.7500011 -4.75000005,0 0,0.5 4.75000005,0 0,3.75 0.5,0 0,-3.75 11.7500001,0 0,-0.5 -11.7500001,0 0,-5.7500011 -0.5,0 z m -5.21875005,-0.050286 0,0.3059125 0,9.7509627 0,0.305912 0.25,0 17.12500015,0 0.25,0 0,-0.305912 0,-9.7509627 0,-0.3059125 -0.25,0 -17.12500015,0 -0.25,0 z m 0.5,0.611825 16.62500015,0 0,9.1391372 -16.62500015,0 0,-9.1391372 z"
  };

  var dataPaths = {
    "dataObject" : "M5,5L45,5L55,15L55,65L5,65L5,5M45,5L45,15L55,15",
    "dataObjectReference" : "M5,5L45,5L55,15L55,65L5,65L5,5M45,5L45,15L55,15",
    "dataStoreReference" : "m 62.926,15.69 c 0,1.986 -3.62,6.551 -31.267,6.551 -27.646,0 -30.734,-4.686 -30.734,-6.454 m 0,-4.65 c 0,1.769 3.088,6.455 30.734,6.455 27.647,0 31.267,-4.565 31.267,-6.551 M 0.925,6.487 c 0,2.35 3.088,6.455 30.734,6.455 27.647,0 31.267,-3.912 31.267,-6.552 m 0,0.001 v 4.844 M 0.949,6.391 v 4.844 m 61.977,-0.194 v 4.844 M 0.949,11.041 v 4.844 M 31.634,0.662 c 20.013,0 31.292,3.05 31.292,5.729 0,2.678 0,45.096 0,48.244 0,3.148 -16.42,6.2 -31.388,6.2 -14.968,0 -30.613,-2.955 -30.613,-6.298 0,-3.342 0,-45.728 0,-48.05 0,-2.322 10.697,-5.825 30.709,-5.825 z"
  };

  var activityMarkerPaths = {
    "loop": "M 0 0 L 0 3 L -3 3 M 0 3 A 4.875,4.875 0 1 1 4 3",
    "miSeq": "M 0 -2 h10 M 0 2 h10 M 0 6 h10",
    "miPar": "M 0 -2 v8 M 4 -2 v8 M 8 -2 v8",
    "adhoc": "m 0 0 c -0.54305,0.60192 -1.04853,1.0324 -1.51647,1.29142 -0.46216,0.25908 -0.94744,0.38857 -1.4558,0.38857 -0.57194,0 -1.23628,-0.22473 -1.99307,-0.67428 -0.0577,-0.0306 -0.10111,-0.0534 -0.12999,-0.0687 -0.0346,-0.0228 -0.0896,-0.0533 -0.16464,-0.0915 -0.80878,-0.47234 -1.4558,-0.70857 -1.94107,-0.70857 -0.46217,0 -0.91566,0.14858 -1.36047,0.44576 -0.44485,0.2895 -0.92434,0.75046 -1.43849,1.38285 l 0,-2.03429 c 0.54881,-0.60194 1.05431,-1.0324 1.51647,-1.29147 0.46793,-0.26666 0.9532,-0.39999 1.45581,-0.39999 0.57191,0 1.24205,0.22856 2.01039,0.68574 0.0461,0.0308 0.0838,0.0533 0.11266,0.0687 0.0404,0.0228 0.0982,0.0533 0.1733,0.0913 0.803,0.4724 1.45002,0.70861 1.94108,0.70857 0.44481,4e-5 0.88676,-0.14475 1.32581,-0.43429 0.43905,-0.2895 0.9272,-0.75425 1.46448,-1.39428",
    "compensate": "M 50 70 L 55 65 L 55 75z M44.7 70 L49.7 75 L 49.7 65z"
  };

  BpmnElementRenderer.labelPadding = 2;
  BpmnElementRenderer.wordWrapMaxWidth = 100 + BpmnElementRenderer.labelPadding;

  var regularStroke = "#444";
  var highlightStroke = "darkOrange";


  var defaultStyle = {
    "stroke-width": 0
  };

  var generalStyle = {
    stroke: regularStroke,
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-opacity" : 1
  };

  var groupStyle = {
    stroke: regularStroke,
    "stroke-width": 2,
    "stroke-opacity" : 1
  };

  var dataObjectStyle = {
    stroke: regularStroke,
    "stroke-width": 1,
    "stroke-opacity" : 1
  };

  var eventStyle = {
     stroke: regularStroke,
    "stroke-width": 1.5,
    "fill": "white"
  };

  var endEventStyle = {
    "stroke-width": 3
  };

  var activityStyle = {
    "stroke": regularStroke,
    "stroke-width": 1,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-opacity" : 1,
    "fill": "white"
  };

  var callActivityStyle = {
    stroke: regularStroke,
    "stroke-width": 3,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-opacity" : 1,
    "fill": "white"
  };

  var userTaskStyle = {
    stroke: regularStroke,
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-opacity" : 1,
    "fill": "black"
  };

  var gatewayStyle = {
    "fill": "white"
  };

  var participantStyle = {
    "stroke": regularStroke
  };

  var laneStyle = {
    "stroke": "#ccc"
  };

  var gatewayMarkerStyle = {
    stroke: regularStroke,
    fill :  regularStroke,
    "stroke-opacity" : 1,
    "stroke-width": 4
  };

  var sequenceFlowStyle = {
    "fill" : regularStroke,
    "style" : "Solid",
    "stroke-width": 2,
    "arrow-end": "block-midium-midium",
    "stroke-linecap": "square",
    "stroke-linejoin": "round"
  };

  var associationStyle = {
    "stroke" : regularStroke,
    "style" : "Dot",
    "stroke-width": 2,
    "arrow-end": "block-midium-midium",
    "stroke-linecap": "square",
    "stroke-linejoin": "round"
  };

  var messageFlowStyle = {
    "stroke-width": 2,
    "arrow-end": "open-wide-long",
    "stroke-dasharray": "-",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  };

  var textStyle = {
    "font-size": 12,
    "font-family": "Arial"
  };

  var textBigStyle = {
    "font-size": 20,
    "font-family": "Arial, Helvetica, sans-serif"
  };

  var styleMap = {
    "startEvent" : eventStyle,
    "endEvent" : lang.mixin(lang.clone(eventStyle), endEventStyle),
    "boundaryEvent" : eventStyle,
    "intermediateCatchEvent" : eventStyle,
    "intermediateThrowEvent" : eventStyle,
    "exclusiveGateway" : generalStyle,
    "inclusiveGateway" : generalStyle,
    "complexGateway" : generalStyle,
    "parallelGateway" : lang.mixin(lang.clone(eventStyle), {"stroke-width" : 3}),
    "eventBasedGateway" : generalStyle,
    "userTask" : activityStyle,
    "serviceTask" : activityStyle,
    "callActivity" : callActivityStyle,
    "manualTask" : activityStyle,
    "receiveTask" : activityStyle,
    "scriptTask" : activityStyle,
    "sendTask" : activityStyle,
    "businessRuleTask" : activityStyle,
    "task": activityStyle,
    "subProcess" :  activityStyle,
    "adHocSubProcess" :  activityStyle,
    "process" : participantStyle,
    "lane" : laneStyle,
    "sequenceFlow" : lang.mixin(lang.clone(generalStyle), sequenceFlowStyle),
    "textAnnotation" : generalStyle,
    "association" : associationStyle,
    "dataStoreReference" : dataObjectStyle,
    "dataObject" : dataObjectStyle
  };

  function wordWrap (text, group, font, x, y, align) {
    var tempText = "";
    var fontSize = font.size ? font.size :  10;
    var defaultAlign = "right";

    if(!text) {
      return;
    }

    var text = text.replace(/&#xD;/g, "<w>").replace(/&#xA;/g, "<w>").replace(/\n/g, "<w>");
    var textLines = []; // the lines which will be used to render

    if (text.indexOf("<w>") != -1) { // there are line breaks, use them
      textLines = text.split("<w>");
    }else { // no line breaks, try to wrap
      var words = text.split(" ");

      if (words.length == 1) {
        textLines.push(text);
      }else {
        var currentLine = "";
        var oldLine = "";

        // append word for word, render the resulting line and check against the configured max width
        // TODO check if there is a "native" way to do, for example in SVG
        for (var i=0; i < words.length; i++) {
          currentLine = oldLine + words[i] + " ";
          var lastWord = i == (words.length -1);

          // create temporary gfx group the check the real rendered width
          var tempTextGroup = group.createText({text: currentLine, align: align ? align : defaultAlign})
            .setFont(font) //set font
            .setFill("black");

          if (tempTextGroup.getTextWidth() > BpmnElementRenderer.wordWrapMaxWidth) {
            textLines.push(oldLine.trim());
            oldLine = words[i];
            if (lastWord) textLines.push(words[i])
          } else if (lastWord) {
            textLines.push(currentLine.trim());
          } else { // continue with current line
            oldLine = currentLine;
          }

          tempTextGroup.getParent().remove(tempTextGroup); // remove temporary gfx group
        }
      }
    }

    for (var i=0; i<textLines.length; i++) {
      var textLine = group.createText({text: textLines[i], align: align ? align : defaultAlign})
        .setFont(font) //set font
        .setFill("black");

      textLine.setTransform({dx: x, dy: y + i*fontSize});
    }

    return textLines;
  }

  function renderLabel(elementRenderer, group, bounds, align) {
    var baseElement = elementRenderer.baseElement;

    if (!baseElement.name) {
      return;
    }
    var font = { family: textStyle["font-family"], size: textStyle["font-size"], weight: "normal" };

    var labelBounds = elementRenderer.getLabelBounds();
    var pos = labelBounds ? {x: +labelBounds.x + BpmnElementRenderer.labelPadding, y: +labelBounds.y + BpmnElementRenderer.labelPadding} : {x: +bounds.x, y: +bounds.y};

    var x =  pos.x,
        y = pos.y;

    wordWrap(baseElement.name, group, font, +x, +y, labelBounds ? null : align);

    return group;
  }

  var processRenderer = {
    render : function(elementRenderer, gfxGroup) {
      var baseElement = elementRenderer.renderElement;
      var style = elementRenderer.getStyle(baseElement);
      var bounds = elementRenderer.renderBounds;

      // no participant bounds
      if (!bounds) {
        return;
      }

      var x = +bounds.x;
      var y = +bounds.y;
      var width = +bounds.width;
      var height = +bounds.height;

      var processGroup = gfxGroup.createGroup();
      processGroup.setTransform({dx :x, dy:y});

      var rect = processGroup.createRect({ x: 0, y: 0, width: width, height: height});
      rect.setStroke(style.stroke);

      var label = baseElement.name;
      if (label) {
        var text = processGroup.createText({ x: 0, y: 0, text: label });

        text.setFont({ family: "Arial", size: "9pt", weight: "normal", align: "middle"}); //set font
        text.setFill("black");
        // FIXME this 30 looks like a magic number
        text.setTransform([gfx.matrix.translate(15, height/2 +30), gfx.matrix.rotateg(-90) ]);
      }

      var separator = processGroup.createLine({ x1: 30, y1: 0, x2: 30, y2: height});
      separator.setStroke(style.stroke);
    }
  };

  var laneRenderer = {
    render : function(elementRenderer, gfxGroup) {
      var baseElement = elementRenderer.baseElement;
      var style = elementRenderer.getStyle();
      var bounds = elementRenderer.getBounds();

      var x = +bounds.x;
      var y = +bounds.y;
      var width = +bounds.width;
      var height = +bounds.height;

      var laneGroup = gfxGroup.createGroup();
      laneGroup.setTransform({dx :x, dy:y});

      var rect = laneGroup.createRect({ x: 0, y: 0, width: width, height: height});
      rect.setStroke(style.stroke);

      var label = elementRenderer.baseElement.name;
      if (label) {
        var text = laneGroup.createText({ x: 0, y: 0, text: label });

        text.setFont({ family: "Arial", size: "9pt", weight: "normal", align: "middle"}); //set font
        text.setFill("black");

        text.setTransform([gfx.matrix.translate(15, height/2 + 30), gfx.matrix.rotateg(-90) ]);
      }
    }
  };

  var connectionRenderer = {
    render : function(elementRenderer, gfxGroup) {
      var baseElement = elementRenderer.baseElement;
      var style = elementRenderer.getStyle();
      var waypoints = elementRenderer.getWaypoints();

      var flowGroup = gfxGroup.createGroup();

      var line = flowGroup.createPolyline(waypoints);
      line.setStroke({color: style.stroke, style : style.style});

      var secondLastPoint = waypoints[waypoints.length-2];
      var lastPoint = waypoints[waypoints.length-1];

      var vector = {x:lastPoint.x - secondLastPoint.x, y: lastPoint.y - secondLastPoint.y};

      var xsize = 6;
      var ysize = 4;

      var svgPath = "M" + lastPoint.x +
        " " + lastPoint.y +
        " L"+ (lastPoint.x - xsize) +
        " " + (lastPoint.y + ysize) +
        " L"+ (lastPoint.x - xsize) +
        " " + (lastPoint.y - ysize) +
        " Z";

      if (elementRenderer.isDirectedFlow()) {
        var arrowGroup = flowGroup.createGroup();
        var arrowPath = arrowGroup.createPath(svgPath);
        var theta = Math.atan2(-vector.y, vector.x);

        arrowPath.setStroke({color : style.stroke});
        arrowPath.setFill(style.fill);
        arrowPath.setTransform([gfx.matrix.rotateAt(-theta, lastPoint)]);
      }

      var sumx = 0;
      var sumy = 0;
      var count = 0;

      for (var index in waypoints) {
        var waypoint = waypoints[index];
        var factor = 1;

        if (waypoints.length > 2 && index == 1) {
          factor = 12;
        }

        sumx += +waypoint.x * factor;
        sumy += +waypoint.y * factor;
        count+= factor;
      }

      renderLabel(elementRenderer, gfxGroup, {x: sumx / count, y: sumy / count}, "middle");
    }
  };

  var gatewayRenderer = {
    render : function(elementRenderer, gfxGroup) {
      var baseElement = elementRenderer.baseElement;
      var style = elementRenderer.getStyle();
      var bounds = elementRenderer.getBounds();

      var x = +bounds.x;
      var y = +bounds.y;
      var width = +bounds.width;
      var height = +bounds.height;

      var gatewayGroup = gfxGroup.createGroup();
      gatewayGroup.setTransform({dx :x, dy:y});

      var rect = gatewayGroup.createPolyline([
        {x: width/2, y: 0},
        {x: width, y: height/2},
        {x: width/2, y: height},
        {x: 0, y: height/2},
        {x: width/2, y: 0}
      ]);

      rect.setStroke(style.stroke);
      rect.setFill(style.fill);

      var symbolGroup = gatewayGroup.createGroup();
      var symbolSize = (height/2) * 0.80;
      var stroke = {color: style.stroke, width : style["stroke-width"]};

      switch (baseElement.type) {
        case "eventBasedGateway":
          var outercircle = symbolGroup.createCircle({ cx: width/2, cy: height/2, r: symbolSize*0.80 }).setStroke(style.stroke);
          var innercircle = symbolGroup.createCircle({ cx: width/2, cy: height/2, r: symbolSize*0.65 }).setStroke(style.stroke);
          var eventpath = symbolGroup.createPath(eventDefinitionPaths["multiple"]).setStroke(style.stroke).setTransform({dx: width/2-4.5, dy: height/2-8});
          break;

        case "exclusiveGateway":

          var symbol = symbolGroup.createText({ x: width/2, y: height /2, text: "X", align: "middle" })
            .setFont({ family: "Arial", size: symbolSize+"pt"}) //set font
            .setStroke(stroke)
            .setFill(gatewayMarkerStyle.fill);
          symbol.setTransform({dy: symbolSize/2, dx: 0});
          break;

        case "complexGateway":

          var symbol = symbolGroup.createText({ x: width/2, y: height /2, text: "X", align: "middle" })
            .setFont({ family: "Arial", size: symbolSize+"pt"}) //set font
            .setStroke(stroke)
            .setFill(gatewayMarkerStyle.fill);
          stroke.width = 4;
          symbolGroup.createLine({ x1: width/2, y1: height*0.2, x2: width/2, y2: height - height * 0.2}).setStroke(stroke);
          symbolGroup.createLine({ x1: width * 0.2, y1: height/2, x2: width  -width*0.2, y2: height/2}).setStroke(stroke);
          symbol.setTransform({dy: symbolSize/2, dx: 0});
          break;

        case "parallelGateway":
          symbolGroup.createLine({ x1: width/2, y1: height*0.2, x2: width/2, y2: height - height * 0.2}).setStroke(stroke);
          symbolGroup.createLine({ x1: width * 0.2, y1: height/2, x2: width  -width*0.2, y2: height/2}).setStroke(stroke);
          break;

        case "inclusiveGateway":
          var symbol = symbolGroup.createCircle({ cx: width/2, cy: height/2, r: symbolSize*0.5 })
            .setStroke(stroke);
          break;
      }

      renderLabel(elementRenderer, gfxGroup, {x: x + width/2, y: y + height + 10}, "middle");
    }
  };

  var activityRenderer = {
    render : function(elementRenderer, gfxGroup) {
      var baseElement = elementRenderer.baseElement;
      var style = elementRenderer.getStyle();
      var bounds = elementRenderer.getBounds();

      var x = +bounds.x;
      var y = +bounds.y;
      var width = +bounds.width;
      var height = +bounds.height;

      var taskGroup = gfxGroup.createGroup();
      taskGroup.setTransform({dx :x, dy:y});

      var strokeStyle = {color : style.stroke, width: style["stroke-width"]};

      if(baseElement.triggeredByEvent == "true") {
        strokeStyle.style = "Dot";
      }

      var rect = taskGroup.createRect({ x: 0, y: 0, width: width, height: height, r: 5 });
      rect.setStroke(strokeStyle);
      rect.setFill(style.fill);

      function createServiceTaskPath(group, style) {
        var path1String = "m 20.347,4.895 -2.561,2.56 0.943,2.277 3.624,0 0,3.383 -3.622,0 -0.943,2.277 2.563,2.563 -2.393,2.392 -2.561,-2.561 -2.277,0.943 0,3.624 -3.383,0 0,-3.622 L 7.46,17.788 4.897,20.35 2.506,17.958 5.066,15.397 4.124,13.12 l -3.624,0 0,-3.383 3.621,0 0.944,-2.276 -2.562,-2.563 2.392,-2.392 2.56,2.56 2.277,-0.941 0,-3.625 3.384,0 0,3.621 2.276,0.943 2.562,-2.562 z";
        var path1 = group.createPath(path1String);
        path1.setStroke({color : style.stroke, width: 1.5});
        path1.setTransform({dx: 5, dy:5, xx: 0.7, yy:0.7});

        var path2String = "m 15.141,11.426 c 0,2.051185 -1.662814,3.714 -3.714,3.714 -2.0511855,0 -3.7139999,-1.662815 -3.7139999,-3.714 0,-2.0511859 1.6628144,-3.7140003 3.7139999,-3.7140003 2.051186,0 3.714,1.6628144 3.714,3.7140003 z";
        var path2 = group.createPath(path2String);
        path2.setStroke({color : style.stroke, width: 1.5});
        path2.setTransform({dx: 5, dy:5, xx: 0.7, yy:0.7});

        var path3String = "m 26.347,10.895 -2.561,2.56 0.943,2.277 3.624,0 0,3.383 -3.622,0 -0.943,2.277 2.563,2.563 -2.393,2.392 -2.561,-2.561 -2.277,0.943 0,3.624 -3.383,0 0,-3.622 -2.277,-0.943 -2.563,2.562 -2.391,-2.392 2.56,-2.561 -0.942,-2.277 -3.624,0 0,-3.383 3.621,0 0.944,-2.276 -2.562,-2.563 2.392,-2.392 2.56,2.56 2.277,-0.941 0,-3.625 3.384,0 0,3.621 2.276,0.943 2.562,-2.562 z";
        var path3 = group.createPath(path3String);
        path3.setStroke({'fill':'#ffffff', color : style.stroke, width: 1.5});
        path3.setTransform({dx: 5, dy:5, xx: 0.7, yy:0.7});
        path3.setFill("#ffffff");

        var path4String = "m 21.141,17.426001 c 0,2.051185 -1.662814,3.714 -3.714,3.714 -2.051186,0 -3.714,-1.662815 -3.714,-3.714 0,-2.051186 1.662814,-3.714 3.714,-3.714 2.051186,0 3.714,1.662814 3.714,3.714 z";
        var path4 = group.createPath(path4String);
        path4.setStroke({color : style.stroke, width: 1.5});
        path4.setTransform({dx: 5, dy:5, xx: 0.7, yy:0.7});
      }

      function createUserTaskPath(group, style) {
        var path1String = "m 6.0095,22.5169 h 16.8581 v -5.4831 c 0,0 -1.6331,-2.7419 -4.9581,-3.6169 h -6.475 c -3.0919,0.9331 -5.4831,4.025 -5.4831,4.025 l 0.0581,5.075 z";
        var path1 = group.createPath(path1String);
        path1.setStroke({color : style.stroke, width: 0.69999999});
        path1.setFill("#f4f6f7");

        var path2String = "m 9.8,19.6 0,2.8";
        var path2 = group.createPath(path2String);
        path1.setFill("none");
        path2.setStroke({color : style.stroke, width: 0.69999999});

        var path3String = "m 19.6,19.6 0,2.8";
        var path3 = group.createPath(path3String);

        path3.setStroke({color : style.stroke, width: 0.69999999});

        var path4String = "m 18.419,5.9159999 c 0,2.9917264 -2.425274,5.4170001 -5.417,5.4170001 -2.991727,0 -5.417,-2.4252737 -5.417,-5.4170001 0,-2.9917264 2.425273,-5.41699983 5.417,-5.41699983 2.991726,0 5.417,2.42527343 5.417,5.41699983 z";
        var path4 = group.createPath(path4String);
        path4.setStroke({color : style.stroke, width: 1.5});
        path4.setTransform({dx: 5, dy:5, xx: 0.75, yy:0.75});
        path4.setFill(style.stroke);

        var path5String = "m 11.2301,10.5581 c 0,0 1.9698,-1.6982 3.7632,-1.2649 1.7934,0.4333 3.2368,-0.4851 3.2368,-0.4851 0.175,1.1816 0.0294,2.625 -1.0206,3.9088 0,0 0.7581,0.525 0.7581,1.05 0,0.525 0.0875,1.3125 -0.7,2.1 -0.7875,0.7875 -3.85,0.875 -4.725,0 -0.875,-0.875 -0.875,-1.2831 -0.875,-1.8669 0,-0.5838 0.4081,-0.875 0.875,-1.3419 -0.7581,-0.4081 -1.7493,-1.6625 -1.3125,-2.1 z";

        var path5 = group.createPath(path5String);
        path5.setStroke({color : style.stroke, width: 0.69999999});
        path5.setFill("#f0eff0");
      }

      function createTaskPath(group, style, path) {
        var path = taskGroup.createPath(path);
        path.setStroke({color : style.stroke, width: 1.5});
        path.setTransform({dx: 5, dy:5});
      }

      if (taskDefinitionPaths[baseElement.type]) {

        if (baseElement.type == 'serviceTask') {
          createServiceTaskPath(taskGroup, style);
        } else
        if (baseElement.type == 'userTask') {
          createUserTaskPath(taskGroup, style);
        } else {
          createTaskPath(taskGroup, style, taskDefinitionPaths[baseElement.type]);
        }
      }

      var text = renderLabel(elementRenderer, gfxGroup, {x: x + width /2 , y: y + height /2}, "middle");
    }
  };

  var eventRenderer = {
    render : function(elementRenderer, gfxGroup) {
      var style = elementRenderer.getStyle();
      var bounds = elementRenderer.getBounds();
      var element = elementRenderer.baseElement;
      var eventType = elementRenderer.getEventType();

      var strokeStyle = "Solid";
      // mark as non-interrupting if necessary
      if (element.cancelActivity == "false") {
        strokeStyle = "ShortDash";
      }

      if (element.isInterrupting == "false") {
        strokeStyle = "ShortDash";
      }

      var strokeStyle = {color: style.stroke, style: strokeStyle, width: style["stroke-width"]};
      var fill = style.fill;

      var x = +bounds.x + strokeStyle.width/2;
      var y = +bounds.y + strokeStyle.width/2;

      var rad = +bounds.width / 2 - strokeStyle.width;

      // render basic circle
      var circleGroup = gfxGroup.createGroup();
      circleGroup.setTransform({dx :x, dy:y});

      var circle = circleGroup.createCircle({cx :rad, cy :rad, r:rad});

      circle.setStroke(strokeStyle);
      circle.setFill(fill);

      if (elementRenderer.isIntermediateEvent()) {
        var innerCircle = circleGroup.createCircle({cx :rad, cy :rad, r:rad * 0.8});
        innerCircle.setStroke(strokeStyle);
        innerCircle.setFill(fill);
      }

      if (element.eventDefinitions && element.eventDefinitions.length > 0) {
        // FIXME only looking for the first one for now
        var definitionType = element.eventDefinitions[0].type;
        var typeLookup = definitionType;

        if (/^message/i.test(definitionType)) {
          typeLookup = "message"+eventType;
        }

        if (element.eventDefinitions.length > 1) {
          typeLookup = "multiple";
          if (element.parallelMultiple == "true") {
            typeLookup = "multipleParallel";
          }
        } else {
          if (definitionType == "terminateEventDefinition") {
            var innerCircle = circleGroup.createCircle({cx :rad, cy :rad, r:rad * 0.75});
            //innerCircle.setStroke(strokeStyle);
            innerCircle.setFill("black");
          }

        }

        var path = circleGroup.createPath(eventDefinitionPaths[typeLookup]);
        var pathBounds = path.getBoundingBox();

        path.setStroke(style.stroke);
        path.setTransform({dx: rad - (pathBounds ? pathBounds.width / 4 : 0) - strokeStyle.width/4, dy: rad - (pathBounds ? pathBounds.height / 2 : 0)});
        if (eventType == "throw") {
          path.setFill("black");
        }
      }

      if (element.type == "boundaryEvent") {
        elementRenderer.postRenderParent(function() {
          circleGroup.moveToFront();
        });
      }

      renderLabel(elementRenderer, gfxGroup, {x : x + +bounds.width / 2, y : y + +bounds.width + rad}, "middle");

      return circle;
    }
  };

  var textAnnotationRenderer = {
    render : function(elementRenderer, gfxGroup) {
      var style = elementRenderer.getStyle();
      var bounds = elementRenderer.getBounds();

      var x = +bounds.x;
      var y = +bounds.y;

      var width = +bounds.width;
      var height= +bounds.height;

      // render basic circle
      var annotationGroup = gfxGroup.createGroup();
      annotationGroup.setTransform({dx :x ,dy: y});

      annotationGroup.createPolyline([
        {x: 10, y: 0},
        {x: 0, y: 0},
        {x: 0, y: height},
        {x: 10, y: height }
      ]).setStroke(style.stroke);

      var font = { family: textStyle["font-family"], size: textStyle["font-size"], weight: "normal" };
      var padding = 4;

      wordWrap(elementRenderer.baseElement.text, annotationGroup, font, padding, font.size + padding, "left");
    }
  };

  var dataRefRenderer = {
    render : function(elementRenderer, gfxGroup) {
      var style = elementRenderer.getStyle();
      var bounds = elementRenderer.getBounds();

      var x = +bounds.x;
      var y = +bounds.y;

      var width = +bounds.width;
      var height= +bounds.height;

      // render basic circle
      var dataRefGroup = gfxGroup.createGroup();
      dataRefGroup.setTransform({dx :x ,dy: y});

      var font = { family: textStyle["font-family"], size: textStyle["font-size"], weight: "normal" };

      var path = dataRefGroup.createPath(dataPaths[elementRenderer.baseElement.type]).setStroke(style.stroke);
      renderLabel(elementRenderer, gfxGroup, {x: x + width/2, y: y + height + 10}, "middle");
      return path;
    }
  };

  // build up the map of renderers
  var RENDERER_DELEGATES = {};
  RENDERER_DELEGATES["process"] = processRenderer;
  RENDERER_DELEGATES["startEvent"] = eventRenderer;
  RENDERER_DELEGATES["endEvent"] = eventRenderer;
  RENDERER_DELEGATES["boundaryEvent"] = eventRenderer;
  RENDERER_DELEGATES["intermediateCatchEvent"] = eventRenderer;
  RENDERER_DELEGATES["intermediateThrowEvent"] = eventRenderer;
  RENDERER_DELEGATES["userTask"] = activityRenderer;
  RENDERER_DELEGATES["task"] = activityRenderer;
  RENDERER_DELEGATES["subProcess"] = activityRenderer;
  RENDERER_DELEGATES["adHocSubProcess"] = activityRenderer;
  RENDERER_DELEGATES["serviceTask"] = activityRenderer;
  RENDERER_DELEGATES["callActivity"] = activityRenderer;
  RENDERER_DELEGATES["manualTask"] = activityRenderer;
  RENDERER_DELEGATES["receiveTask"] = activityRenderer;
  RENDERER_DELEGATES["scriptTask"] = activityRenderer;
  RENDERER_DELEGATES["sendTask"] = activityRenderer;
  RENDERER_DELEGATES["businessRuleTask"] = activityRenderer;
  RENDERER_DELEGATES["exclusiveGateway"] = gatewayRenderer;
  RENDERER_DELEGATES["inclusiveGateway"] = gatewayRenderer;
  RENDERER_DELEGATES["parallelGateway"] = gatewayRenderer;
  RENDERER_DELEGATES["eventBasedGateway"] = gatewayRenderer;
  RENDERER_DELEGATES["complexGateway"] = gatewayRenderer;
  RENDERER_DELEGATES["sequenceFlow"] = connectionRenderer;
  RENDERER_DELEGATES["association"] = connectionRenderer;
  RENDERER_DELEGATES["lane"] = laneRenderer;
  RENDERER_DELEGATES["textAnnotation"] = textAnnotationRenderer;
  RENDERER_DELEGATES["dataStoreReference"] = dataRefRenderer;
  RENDERER_DELEGATES["dataObjectReference"] = dataRefRenderer;
  RENDERER_DELEGATES["dataObject"] = dataRefRenderer;

  var RenderingException = (function () {

    function RenderingException(message, bpmnElementRenderer) {
      this.message = message;
      this.bpmnElementRenderer = bpmnElementRenderer;
      throw message;
    }

    return RenderingException;
  })();


  BpmnElementRenderer.prototype.postRenderParent = function(callback) {
    this.options.postRenderCallbacks.push(callback);
  };

  BpmnElementRenderer.prototype.render = function(options, gfxGroup) {
    this.gfxGroup = gfxGroup;
    this.options = options;

    // create surface element if needed
    if (!gfxGroup) {
      var width = options.width ? options.width : 800;
      var height = options.height ? options.height : 600;

      gfxGroup = this.gfxGroup = gfx.createSurface(options.diagramElement, width, height).createGroup();
    }

    // baseelement might be a array of processes
    var elements = [].concat(this.baseElement);

    for (var index in elements) {
      // TODO use this elements in all renderers, currently they are using the elementRenderer ref to get this stuff
      var currentElement = this.renderElement = elements[index];
      var bounds = this.renderBounds = this.getElementBounds(currentElement);

      if (bounds) {
        var diagramElement = query("#"+options.diagramElement)[0];
        diagramElement.style.position = "relative";

        var overlayDiv = domConstruct.create("div", {
          id : currentElement.id,
          innerHTML : options.overlayHtml ? options.overlayHtml : null,
          style: {
            position: "absolute" ,
            left: +bounds.x +"px",
            top: +bounds.y + "px",
            width : +bounds.width + "px",
            height : +bounds.height + "px"
          }
        },
        diagramElement);
        domClass.add(overlayDiv, "bpmnElement");
      }


      var delegate = RENDERER_DELEGATES[currentElement.type];
      if(!!delegate) {
        this.svgElement = delegate.render(this, gfxGroup);
      } else {
        console.log("Unable to render element of type ", this.baseElement.type);
      }

      // if the current element has child base elements, create the
      // subordinate renderers
      if(!!currentElement.baseElements) {
        var postRenderCallbacks = [];
        var renderingOpts = lang.mixin(lang.clone(options), { postRenderCallbacks: postRenderCallbacks });
        
        for(var i = 0; i < currentElement.baseElements.length; i++) {
          new BpmnElementRenderer(currentElement.baseElements[i], this).render(renderingOpts, gfxGroup);
        }

        for (var j = 0, fn; !!(fn = postRenderCallbacks[j]); j++) {
          fn();
        }
      }
    }
  };

  function getBoundsFromChildren(diChildren) {
    for (var index in diChildren) {
      var diChild = diChildren[index];

      if (/bounds/i.test(diChild.type)) {
        return diChild;
      }

    }
    return null;
  };

  BpmnElementRenderer.prototype.getLabelBounds = function () {

    // first check by type
    switch (this.baseElement.type) {
      case "adHocSubProcess":
      case "subProcess":
        return {x: this.baseElement.bounds.x + textStyle["font-size"] + BpmnElementRenderer.labelPadding, y: +this.baseElement.bounds.y + textStyle["font-size"] + BpmnElementRenderer.labelPadding};
        break;
    }

    var diChildren = this.baseElement.bpmndi[0].children;

    for (var index in diChildren) {
      var diChild = diChildren[index];

      if (/BPMNLabel/i.test(diChild.type)) {
        return getBoundsFromChildren(diChild.children);
      }

    }
    return null;
  };

  BpmnElementRenderer.prototype.getBounds = function() {
    if (this.baseElement instanceof Array) {
      var outerBounds = {x:10000, y: 10000, width:1, height :1};

      for (var index in this.baseElement) {
        var boundsElement = this.baseElement[index];
        var elementBounds = this.getElementBounds(boundsElement);

        if (elementBounds) {
          outerBounds.x = Math.min(+elementBounds.x, +outerBounds.x);
          outerBounds.y = Math.min(+elementBounds.y, +outerBounds.y);
          outerBounds.width = Math.max(+elementBounds.x + +elementBounds.width, +outerBounds.width);
          outerBounds.height = Math.max(+elementBounds.y + +elementBounds.height, +outerBounds.height);
        }

      }
      return outerBounds;
    } else {
      if (this.baseElement.bounds) {
        return this.baseElement.bounds;
      }

      var elementBounds = this.getElementBounds(this.baseElement);
      this.baseElement.bounds = elementBounds;

      return elementBounds;
    }
  };

  BpmnElementRenderer.prototype.getElementBounds = function (baseElement) {
    if (!baseElement.bpmndi) {
      return null;
    }

    var diChildren = baseElement.bpmndi[0].children;

    var bounds = getBoundsFromChildren(diChildren);

    if (!bounds) {
      return;
    }

    //FIXME move this
    var currentCanvasDimension = this.getSurface().getDimensions();

    var boundsWidth = +bounds.x + +bounds.width;
    var boundsHeight = +bounds.y + +bounds.height;
    var padding = 50;

    //FIXME, should never go lower in a axis
    if ( boundsWidth > currentCanvasDimension.width || boundsHeight >  currentCanvasDimension.height) {
      this.getSurface().setDimensions(Math.max(boundsWidth + padding, currentCanvasDimension.width), Math.max(boundsHeight + padding, currentCanvasDimension.height));
    }

    return bounds;
  };

  BpmnElementRenderer.prototype.getWaypoints = function() {
    var waypoints = [];

    var diChildren = this.baseElement.bpmndi[0].children;
    for (var index in diChildren) {
      var diChild = diChildren[index];

      if (/waypoint/i.test(diChild.type)) {
        waypoints.push({x: +diChild.x, y: +diChild.y});
      }

    }
    return waypoints;
  };

  BpmnElementRenderer.prototype.getStyle = function (baseElement) {
    if (!baseElement) {
      return styleMap[this.baseElement.type] ? styleMap[this.baseElement.type] : defaultStyle;
    }else {
      return styleMap[baseElement.type] ? styleMap[baseElement.type] : defaultStyle;
    }
  };

  BpmnElementRenderer.prototype.getEventType = function () {
    var sCatch = "catch";
    var sThrow = "throw";

    switch (this.baseElement.type) {
      case "startEvent":
        return sCatch;
      case "endEvent":
        return sThrow;
      case "intermediateCatchEvent":
        return sCatch;
      case "boundaryEvent":
        return sCatch;
      case "intermediateThrowEvent":
        return sThrow;
    }
    return undefined;
  };

  BpmnElementRenderer.prototype.isIntermediateEvent = function () {
    switch (this.baseElement.type) {
      case "intermediateCatchEvent":
      case "boundaryEvent":
      case "intermediateThrowEvent":
        return true;
      default:
        return false;
    }
  };

  BpmnElementRenderer.prototype.isDirectedFlow = function () {
    switch (this.baseElement.type) {
      case "sequenceFlow":
      case "messageFlow":
        return true;
      default:
        return false;
    }
  };

  BpmnElementRenderer.prototype.getSurface = function () {
    var parent = this.gfxGroup.getParent();

    do {
      if (parent instanceof dojox.gfx.Surface) {
        return parent;
      }
    }while (parent = parent.getParent())

    return null;
  };

  BpmnElementRenderer.prototype.RENDERER_DELEGATES = RENDERER_DELEGATES;

  return BpmnElementRenderer;
});
