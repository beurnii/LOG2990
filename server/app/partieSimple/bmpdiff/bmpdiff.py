import PIL
from PIL import ImageChops
from PIL import Image
import sys
import argparse
import os.path
import cv2
import numpy as np

newImage = PIL.ImageChops.invert(Image.new("RGB", (640, 480), 0))
newpixels = newImage.load()

def file_choices(choices,fname):
    ext = os.path.splitext(fname)[1][1:]
    if ext not in choices:
       parser.error("image de mauvais type, demandé: {}".format(choices))
    return fname

def compare_images(settings, enlargePixels):

    #Ouverture des images et déclaration de constantes
    image_one = Image.open(settings.imageOriginale)
    image_two = Image.open(settings.imageModifie)

    width1 = image_one.size[0]
    height1 = image_one.size[1]
    width2 = image_two.size[0]
    height2 = image_two.size[1]

    pixels_one = np.asarray(image_one)
    pixels_two = np.asarray(image_two)

    #Détection de la mauvaise taille d'image
    if(not (width1 or width2) == 640 or not (height1 or height2) == 480):
        print("Images de mauvaise taille, veuillez choisir des images de type .bmp de taille 640x480")
        return

    #Parcours dans l'image pour trouver les pixels différents
    for y in range(0,width1):
        for x in range(0,height1):

            px_one = pixels_one[x,y]
            px_two = pixels_two[x,y]

            if not (px_one==px_two).all():
                if(enlargePixels):
                    enlarge_pixels(x, y)
                else:
                    newpixels[y, x] = (0, 0, 0)

    #Sauvegarde de l'image
    if (check_number_differences(newImage)):
        newImage.save(settings.imageSortie)
        print('Image de différence générée avec succès!', file=sys.stdout)
        sys.exit(0)
    else:
        print("Le nombre de différences entre les deux images ne correspond pas au nombre demandé! \n"
              "Il faut exactement 7 différences entre les deux images.", file=sys.stderr)
        sys.exit(1)
        
def check_number_differences(newImage):

    #Contouring pour compter les différences
    lower = np.array([0, 0, 0])
    upper = np.array([15, 15, 15])
    image = np.asarray(newImage)
    shapeMask = cv2.inRange(image, lower, upper)

    (_, cnts, _) = cv2.findContours(shapeMask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    return len(cnts) == 7

def enlarge_pixels(x, y):
    #Élargissement des différences
    for i in range(-3, 4):
        for j in range(-3, 4):
            if(not ((abs(i) > 1 and abs(j) == 3) or (abs(j) > 1 and abs(i) == 3))):
                newpixels[y+i,x+j] = (0, 0, 0)

if __name__ == '__main__':

    #Déclaration des arguments
    parser = argparse.ArgumentParser(
        description="Générer une image en noir et blanc décrivant les différences entre deux images")
    parser.add_argument("-partiel", action="store_true", help="Générer une image de différences partielles")
    parser.add_argument('imageOriginale', type=lambda s: file_choices("bmp", s), help="Chemin pointant sur l'image d'origine")
    parser.add_argument('imageModifie', type=lambda s: file_choices("bmp", s), help="Chemin pointant sur l'image modifiée")
    parser.add_argument('imageSortie', type=lambda s: file_choices("bmp", s), help="Chemin où l'image de sortie doit être générée")

    settings = parser.parse_args()

    #Vérification argument -partiel
    if settings.partiel:
        compare_images(settings, 0)
    else:
        compare_images(settings, 1)
    exit()