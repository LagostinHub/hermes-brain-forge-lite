import {Config} from '@remotion/cli/config';

// P3: yuva (WITH alpha) is mandatory for ProRes 4444 transparency.
// Default pixel format is yuv* (no alpha) — the .mov would look fine but
// `ffmpeg -vf alphaextract` fails and AE sees a black/opaque background.
Config.setVideoImageFormat('png');
Config.setPixelFormat('yuva444p10le');
Config.setCodec('prores');
Config.setProResProfile('4444');
Config.setOverwriteOutput(true);
