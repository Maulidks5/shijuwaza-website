<?php

$source = __DIR__.'/../public/images/shijuwaza-logo.png';
$target = __DIR__.'/../public/images/shijuwaza-logo-transparent.png';
$croppedTarget = __DIR__.'/../public/images/shijuwaza-logo-cropped.png';

$image = imagecreatefrompng($source);

if (! $image) {
    fwrite(STDERR, "Unable to read source logo.\n");
    exit(1);
}

$width = imagesx($image);
$height = imagesy($image);
$output = imagecreatetruecolor($width, $height);

imagealphablending($output, false);
imagesavealpha($output, true);

for ($y = 0; $y < $height; $y++) {
    for ($x = 0; $x < $width; $x++) {
        $rgba = imagecolorat($image, $x, $y);
        $red = ($rgba >> 16) & 0xFF;
        $green = ($rgba >> 8) & 0xFF;
        $blue = $rgba & 0xFF;
        $brightness = max($red, $green, $blue);

        if ($brightness > 248) {
            $alpha = 127;
        } elseif ($brightness > 226) {
            $alpha = (int) min(127, (($brightness - 226) / 22) * 127);
        } else {
            $alpha = 0;
        }

        $color = imagecolorallocatealpha($output, $red, $green, $blue, $alpha);
        imagesetpixel($output, $x, $y, $color);
    }
}

imagepng($output, $target, 9);

$minX = $width;
$minY = $height;
$maxX = 0;
$maxY = 0;

for ($y = 0; $y < $height; $y++) {
    for ($x = 0; $x < $width; $x++) {
        $rgba = imagecolorat($output, $x, $y);
        $alpha = ($rgba & 0x7F000000) >> 24;

        if ($alpha < 120) {
            $minX = min($minX, $x);
            $minY = min($minY, $y);
            $maxX = max($maxX, $x);
            $maxY = max($maxY, $y);
        }
    }
}

if ($maxX > $minX && $maxY > $minY) {
    $padding = 24;
    $cropX = max(0, $minX - $padding);
    $cropY = max(0, $minY - $padding);
    $cropWidth = min($width - $cropX, ($maxX - $minX) + ($padding * 2));
    $cropHeight = min($height - $cropY, ($maxY - $minY) + ($padding * 2));
    $cropped = imagecrop($output, [
        'x' => $cropX,
        'y' => $cropY,
        'width' => $cropWidth,
        'height' => $cropHeight,
    ]);

    if ($cropped) {
        imagesavealpha($cropped, true);
        imagepng($cropped, $croppedTarget, 9);
        imagedestroy($cropped);
    }
}

imagedestroy($image);
imagedestroy($output);

echo "Created {$target}\n";
echo "Created {$croppedTarget}\n";
