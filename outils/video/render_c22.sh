#!/bin/bash
B=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
mkdir -p out/pc; rm -f out/pc/*
for a in $(seq 0 60 720); do
  b=$((a+59)); [ $b -gt 764 ] && b=764
  f=out/pc/p$(printf %03d $a).mp4
  for try in 1 2 3; do
    timeout 900 npx remotion render build Certificat $f --frames=$a-$b --browser-executable=$B --concurrency=1 --crf=16 --muted --timeout=60000 --log=error > out/pc/log$a.txt 2>&1
    if [ -s $f ]; then echo "part $a ok ($try)"; break; else echo "part $a échec $try"; fi
  done
  echo "file 'p$(printf %03d $a).mp4'" >> out/pc/list.txt
done
ffmpeg -loglevel error -y -f concat -safe 0 -i out/pc/list.txt -c copy out/certificat-muette.mp4
ffmpeg -loglevel error -y -i out/certificat-muette.mp4 -i out/certificat-son.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/certificat-negatif-date-v3.mp4
ffprobe -v error -count_frames -show_entries stream=nb_read_frames:format=duration -of compact out/certificat-negatif-date-v3.mp4
echo FIN
