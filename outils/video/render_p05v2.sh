#!/bin/bash
# Rendu de la vidéo 5 « Pack Conciergerie » v2 par morceaux de 60 images, puis son et normalisation à -14 LUFS.
# Usage : bash render_p02v2.sh [début fin]  (sans argument : toute la vidéo ; avec : re-rendu des seuls morceaux touchés)
cd "$(dirname "$0")"
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
LAST=884
A0=${1:-0}; A1=${2:-$LAST}
mkdir -p out/pp5v2
for a in $(seq 0 60 $LAST); do
  b=$((a+59)); [ $b -gt $LAST ] && b=$LAST
  [ $b -lt $A0 ] && continue; [ $a -gt $A1 ] && continue
  f=out/pp5v2/p$(printf %04d $a).mp4
  for try in 1 2 3; do
    timeout 900 npx remotion render build Pack05ConciergerieV2 $f --frames=$a-$b --browser-executable=$B --concurrency=2 --crf=14 --muted --gl=swiftshader --timeout=120000 --log=error > out/pp5v2/log$a.txt 2>&1
    if [ -s $f ]; then echo "morceau $a ok ($try)"; break; else echo "morceau $a échec $try"; fi
  done
done
rm -f out/pp5v2/list.txt
for a in $(seq 0 60 $LAST); do echo "file 'p$(printf %04d $a).mp4'" >> out/pp5v2/list.txt; done
ffmpeg -loglevel error -y -f concat -safe 0 -i out/pp5v2/list.txt -c copy out/p05v2-muette.mp4
python3 audio/build_audio_p05v2.py
ffmpeg -loglevel error -y -i out/p05v2-muette.mp4 -i out/p05v2-bande-son.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-2:LRA=11 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/pack-conciergerie.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 out/pack-conciergerie.mp4
echo FIN
