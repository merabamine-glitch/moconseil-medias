#!/bin/bash
cd /home/claude/video-mo
B=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
for a in 540 600; do
  b=$((a+59)); f=out/pp1/p$(printf %04d $a).mp4; rm -f $f
  for try in 1 2 3; do
    timeout 900 npx remotion render build Pack01Creation $f --frames=$a-$b --browser-executable=$B --concurrency=1 --crf=16 --muted --timeout=60000 --log=error > out/pp1/log$a.txt 2>&1
    if [ -s $f ]; then echo "part $a ok ($try)"; break; else echo "part $a echec $try"; fi
  done
done
ffmpeg -loglevel error -y -f concat -safe 0 -i out/pp1/list.txt -c copy out/p01-muette.mp4
ffmpeg -loglevel error -y -i out/p01-muette.mp4 -i out/p01-bande-son.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/MO-Conseil-pack-01-creation-societe-v2.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 out/MO-Conseil-pack-01-creation-societe-v2.mp4
echo FIN
