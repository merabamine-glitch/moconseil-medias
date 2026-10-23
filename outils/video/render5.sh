#!/bin/bash
B=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
mkdir -p out/p5; rm -f out/p5/*
for a in $(seq 0 60 900); do
  b=$((a+59)); [ $b -gt 944 ] && b=944; f=out/p5/p$(printf %03d $a).mp4
  for try in 1 2 3; do
    timeout 900 npx remotion render build PresentationV4A $f --frames=$a-$b --browser-executable=$B --concurrency=1 --crf=16 --muted --timeout=60000 --log=error > out/p5/log$a.txt 2>&1
    if [ -s $f ]; then echo "part $a ok ($try)"; break; else echo "part $a échec $try"; fi
  done
  echo "file 'p$(printf %03d $a).mp4'" >> out/p5/list.txt
done
ffmpeg -loglevel error -y -f concat -safe 0 -i out/p5/list.txt -c copy out/video-muette-v4.mp4
ffmpeg -loglevel error -y -i out/video-muette-v4.mp4 -i out/bande-son-v5.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/MO-Conseil-presentation-voix-v4.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 out/MO-Conseil-presentation-voix-v4.mp4
echo FIN
