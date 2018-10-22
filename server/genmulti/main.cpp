#include <iostream>
#include <math.h>
#include "inf2705-matrice.h"
#include "inf2705-nuanceur.h"
#include "inf2705-fenetre.h"
#include "inf2705-forme.h"
#include "FreeImage.h"
#include <thread>
#include <chrono>
#include <vector>
#include <string>
#include <bits/stdc++.h> 
  
using namespace std; 

// variables pour l'utilisation des nuanceurs
GLuint progBase;  // le programme de nuanceurs de base
GLint locVertex = -1;
GLint locColor = -1;
GLint locmatrModel = -1;
GLint locmatrVisu = -1;
GLint locmatrProj = -1;

// matrices du pipeline graphique
MatricePipeline matrModel, matrVisu, matrProj;

// les formes
FormeCube *cube = NULL;
FormeSphere *sphere = NULL;
FormeCylindre *cylindre = NULL;
FormeCylindre *cone = NULL;
FormePyramideBaseCarree *pyramide = NULL;

// diverses variables d'état
struct Etat
{
   double dimBoite;
   string theme;
   int nombreFormes;
   string modifications;
   string filename;
   string capture1;
   string capture2;
   string capture3;
   string capture4;
} etat = {};

// diverses variables de creation
struct Geometrie
{
   GLfloat tailleReference;           
   GLfloat angleReference;       
} geo = { 4.0, 50 };

GLfloat callRandomSize(GLfloat taille)
{
   int min = 0.5*taille;
   int max = 1.5*taille;
   return rand()%((max - min) + 1) + min; 
}

double callRandomTranslate()
{
   int min = -etat.dimBoite;
   int max = etat.dimBoite;
   return rand()%((max - min) + 1) + min;
}

double callRandom()
{
   return (double)rand()/(RAND_MAX);
}

double callRandomAngle()
{
   int min = -1;
   int max = 1;
   return rand()%((max - min) + 1) + min;
}

double callRandomNumber(int number)
{
   int min = 0;
   int max = number;
   return rand()%((max - min) + 1) + min;
}

struct StructCone
{
    double rayon; double height;
    double angleX; double angleY; double angleZ;
    double translateX; double translateY; double translateZ;
    double colorR; double colorG; double colorB;
};

struct StructCylindre
{
    double rayon; double height;
    double angleX; double angleY; double angleZ;
    double translateX; double translateY; double translateZ;
    double colorR; double colorG; double colorB;
};

struct StructSphere
{
    double tailleX; double tailleY; double tailleZ;
    double angleX; double angleY; double angleZ;
    double translateX; double translateY; double translateZ;
    double colorR; double colorG; double colorB;
};

struct StructCube
{
    double arrete;
    double angleX; double angleY; double angleZ;
    double translateX; double translateY; double translateZ;
    double colorR; double colorG; double colorB;
};

struct StructPyramide
{
    double arrete;
    double angleX; double angleY; double angleZ;
    double translateX; double translateY; double translateZ;
    double colorR; double colorG; double colorB;
};

vector<StructSphere> vecSphere;
vector<StructCube> vecCube;
vector<StructCylindre> vecCylindre;
vector<StructCone> vecCone;
vector<StructPyramide> vecPyramide;

void makeCones(int nombreFormes){
    for(int i = 0; i < nombreFormes; i++){
        StructCone cone = { callRandomSize(geo.tailleReference), callRandomSize(geo.tailleReference),
                                callRandomAngle(), callRandomAngle(), callRandomAngle(),
                                callRandomTranslate(), callRandomTranslate(), callRandomTranslate(),
                                callRandom(), callRandom(), callRandom()
                                };
        vecCone.push_back(cone);
    }
}

void makeCylindres(int nombreFormes){
    for(int i = 0; i < nombreFormes; i++){
        StructCylindre cylindre = { callRandomSize(geo.tailleReference), callRandomSize(geo.tailleReference),
                                callRandomAngle(), callRandomAngle(), callRandomAngle(),
                                callRandomTranslate(), callRandomTranslate(), callRandomTranslate(),
                                callRandom(), callRandom(), callRandom()
                                };
        vecCylindre.push_back(cylindre);
    }
}

void makeSpheres(int nombreFormes){
    for(int i = 0; i < nombreFormes; i++){
        StructSphere sphere = { callRandomSize(geo.tailleReference), callRandomSize(geo.tailleReference), callRandomSize(geo.tailleReference),
                                callRandomAngle(), callRandomAngle(), callRandomAngle(),
                                callRandomTranslate(), callRandomTranslate(), callRandomTranslate(),
                                callRandom(), callRandom(), callRandom()
                                };
        vecSphere.push_back(sphere);
    }
}

void makeCubes(int nombreFormes){
    for(int i = 0; i < nombreFormes; i++){
        StructCube cube = { callRandomSize(geo.tailleReference),
                                callRandomAngle(), callRandomAngle(), callRandomAngle(),
                                callRandomTranslate(), callRandomTranslate(), callRandomTranslate(),
                                callRandom(), callRandom(), callRandom()
                                };
        vecCube.push_back(cube);
    }
}

void makePyramides(int nombreFormes){
    for(int i = 0; i < nombreFormes; i++){
        StructPyramide pyramide = { callRandomSize(geo.tailleReference),
                                callRandomAngle(), callRandomAngle(), callRandomAngle(),
                                callRandomTranslate(), callRandomTranslate(), callRandomTranslate(),
                                callRandom(), callRandom(), callRandom()
                                };
        vecPyramide.push_back(pyramide);
    }
}

// variables pour définir le point de vue
const GLdouble thetaInit = 0.0, phiInit = 80.0, distInit = 65.;
class Camera
{
public:
   void definir()
   {
    if ( modeLookAt )
        {
            matrVisu.LookAt( dist*cos(glm::radians(theta))*sin(glm::radians(phi)),
                            dist*sin(glm::radians(theta))*sin(glm::radians(phi)),
                            dist*cos(glm::radians(phi)) + 5.,
                            0., 0., 5.,
                            0., 0., 1. );
        }
        else
        {   
            const GLdouble theta2Init = 30., phi2Init = 90., dist2Init = 65.;
            matrVisu.LoadIdentity( );
            matrVisu.LookAt( dist2Init*cos(glm::radians(theta2Init))*sin(glm::radians(phi2Init)),
                    dist2Init*sin(glm::radians(theta2Init))*sin(glm::radians(phi2Init)),
                    dist2Init*cos(glm::radians(phi2Init)),
                    1., 0., 5.,
                    0., 0., 1. );
        }
    }
   double theta;         // angle de rotation de la caméra (coord. sphériques)
   double phi;           // angle de rotation de la caméra (coord. sphériques)
   double dist;          // distance (coord. sphériques)
   bool modeLookAt; 
} camera = { thetaInit, phiInit, distInit, true}; 


void chargerNuanceurs()
{
   // charger le nuanceur de base
   {
      // créer le programme
      progBase = glCreateProgram();

      // attacher le nuanceur de sommets
      {
         GLuint nuanceurObj = glCreateShader( GL_VERTEX_SHADER );
         glShaderSource( nuanceurObj, 1, &ProgNuanceur::chainesSommetsMinimal, NULL );
         glCompileShader( nuanceurObj );
         glAttachShader( progBase, nuanceurObj );
         ProgNuanceur::afficherLogCompile( nuanceurObj );
      }
      // attacher le nuanceur de fragments
      {
         GLuint nuanceurObj = glCreateShader( GL_FRAGMENT_SHADER );
         glShaderSource( nuanceurObj, 1, &ProgNuanceur::chainesFragmentsMinimal, NULL );
         glCompileShader( nuanceurObj );
         glAttachShader( progBase, nuanceurObj );
         ProgNuanceur::afficherLogCompile( nuanceurObj );
      }

      // faire l'édition des liens du programme
      glLinkProgram( progBase );
      ProgNuanceur::afficherLogLink( progBase );

      // demander la "Location" des variables
      if ( ( locVertex = glGetAttribLocation( progBase, "Vertex" ) ) == -1 ) cerr << "!!! pas trouvé la \"Location\" de Vertex" << endl;
      if ( ( locColor = glGetAttribLocation( progBase, "Color" ) ) == -1 ) cerr << "!!! pas trouvé la \"Location\" de Color" << endl;
      if ( ( locmatrModel = glGetUniformLocation( progBase, "matrModel" ) ) == -1 ) cerr << "!!! pas trouvé la \"Location\" de matrModel" << endl;
      if ( ( locmatrVisu = glGetUniformLocation( progBase, "matrVisu" ) ) == -1 ) cerr << "!!! pas trouvé la \"Location\" de matrVisu" << endl;
      if ( ( locmatrProj = glGetUniformLocation( progBase, "matrProj" ) ) == -1 ) cerr << "!!! pas trouvé la \"Location\" de matrProj" << endl;
   }
}

void FenetreTP::initialiser()
{
   // donner la couleur de fond
   glClearColor( 0.27, 0.42, 0.77, 1.0 );

   // activer les etats openGL
   glEnable( GL_DEPTH_TEST );

   // charger les nuanceurs
   chargerNuanceurs();

   glUseProgram( progBase );
   cube = new FormeCube( 1.0, true );
   sphere = new FormeSphere( 0.25, 8, 8, true );
   cylindre = new FormeCylindre( 1.0, 1.0, 1.0, 16, 1, true );
   cone = new FormeCylindre( 1.0, 0.0, 1.0, 16, 1, true );
   pyramide = new FormePyramideBaseCarree(1.0, true);
}

void FenetreTP::conclure()
{
   delete cube;
   delete sphere;
   delete cylindre;
   delete cone;
   delete pyramide;
}

// affiche la position courante du repère (pour débogage)
void afficherRepereCourant( int num = 0 )
{
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   FenetreTP::afficherAxes( 1.5, 3.0 );
}

void afficherCylindre( )
{
   cylindre->afficher();
}

void afficherCone( )
{
   cone->afficher();
}

void afficherSphere( )
{
   sphere->afficher();
}

void afficherCube( )
{
   cube->afficher();
}

void afficherPyramide( )
{
   pyramide->afficher();
}

void genererCylindres()
{
   for(vector<StructCylindre>::iterator vec = vecCylindre.begin(); vec != vecCylindre.end(); ++vec){
      matrModel.PushMatrix();
      {
         int height = vec->height;
         int rayon = vec->rayon;
         matrModel.Translate( vec->translateX, vec->translateY, vec->translateZ);
         matrModel.Rotate(geo.angleReference, vec->angleX, vec->angleY, vec->angleZ);
         matrModel.Scale(rayon, rayon, height);
         glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
         glVertexAttrib3f( locColor, vec->colorR, vec->colorG, vec->colorB);
         afficherCylindre();
      }
      matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   }
}

void genererCones()
{
    for(vector<StructCone>::iterator vec = vecCone.begin(); vec != vecCone.end(); ++vec){
      matrModel.PushMatrix();
      {
         int height = vec->height;
         int rayon = vec->rayon;
         matrModel.Translate( vec->translateX, vec->translateY, vec->translateZ);
         matrModel.Rotate(geo.angleReference, vec->angleX, vec->angleY, vec->angleZ);
         matrModel.Scale(rayon, rayon, height);
         glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
         glVertexAttrib3f( locColor, vec->colorR, vec->colorG, vec->colorB);
         afficherCone();
      }
      matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   }
}

void genererSpheres()
{
   for(vector<StructSphere>::iterator vec = vecSphere.begin(); vec != vecSphere.end(); ++vec){
      matrModel.PushMatrix();
      {
         matrModel.Translate( vec->translateX, vec->translateY, vec->translateZ);
         matrModel.Rotate(geo.angleReference, vec->angleX, vec->angleY, vec->angleZ);
         matrModel.Scale(vec->tailleX, vec->tailleY, vec->tailleZ);
         glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
         glVertexAttrib3f( locColor, vec->colorR, vec->colorG, vec->colorB);
         afficherSphere();
      }
      matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   }
}

void genererCubes()
{
   for(vector<StructCube>::iterator vec = vecCube.begin(); vec != vecCube.end(); ++vec){
      matrModel.PushMatrix();
      {
         int arreteCube = vec->arrete;
         matrModel.Translate( vec->translateX, vec->translateY, vec->translateZ);
         matrModel.Rotate(geo.angleReference, vec->angleX, vec->angleY, vec->angleZ);
         matrModel.Scale(arreteCube, arreteCube, arreteCube);
         glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
         glVertexAttrib3f( locColor, vec->colorR, vec->colorG, vec->colorB);
         afficherCube();
      }
      matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   }
}

void genererPyramides()
{
   for(vector<StructPyramide>::iterator vec = vecPyramide.begin(); vec != vecPyramide.end(); ++vec){
      matrModel.PushMatrix();
      {
         int arretePyramide = vec->arrete;
         matrModel.Translate( vec->translateX, vec->translateY, vec->translateZ);
         matrModel.Rotate(geo.angleReference, vec->angleX, vec->angleY, vec->angleZ);
         matrModel.Scale(arretePyramide, arretePyramide, arretePyramide);
         glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
         glVertexAttrib3f( locColor, vec->colorR, vec->colorG, vec->colorB);
         afficherPyramide();
      }
      matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   }
}


void makeFormesGeometriques()
{
    int nombre = etat.nombreFormes;
    cout << nombre << endl;
    int nombreSpheres = callRandomNumber(nombre);
    makeSpheres(nombreSpheres);
    nombre = nombre - nombreSpheres;
    cout << nombreSpheres << ";" <<nombre << endl;
    int nombreCubes = callRandomNumber(nombre);
    makeCubes(nombreCubes);
    nombre = nombre - nombreCubes;
    cout << nombreCubes<< ";" <<nombre << endl;
    int nombrePyramides = callRandomNumber(nombre);
    makePyramides(nombrePyramides);
    nombre = nombre - nombrePyramides;
    cout << nombrePyramides << ";" <<nombre << endl;
    int nombreCones = callRandomNumber(nombre);
    makeCones(nombreCones);
    nombre = nombre - nombreCones;
    cout << nombreCones << ";" <<nombre << endl;
    makeCylindres(nombre);
}

void afficherFormesGeometriques()
{
   matrModel.PushMatrix();{ // sauvegarder la tranformation courante

      genererSpheres();
      genererCubes();
      genererCylindres();
      genererCones();
      genererPyramides();

   }matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
}

void capturerScene(string filepath)
{
    // Make the BYTE array, factor of 3 because it's RBG.
    int width = 640;
    int height = 480; 
    char charArray[100];  
    strcpy(charArray, filepath.c_str());  

    BYTE* pixels = new BYTE[3 * width * height];

    glReadPixels(0, 0, width, height, GL_RGB, GL_UNSIGNED_BYTE, pixels);

    // Convert to FreeImage format & save to file
    FIBITMAP* image = FreeImage_ConvertFromRawBits(pixels, width, height, 3 * width, 24, 0x0000FF, 0xFF0000, 0x00FF00, false);
    FreeImage_Save(FIF_BMP, image, charArray, 0);

    // Free resources
    FreeImage_Unload(image);
    delete [] pixels;
}

void FenetreTP::afficherScene()
{
   // effacer l'ecran et le tampon de profondeur
   glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );

   glUseProgram( progBase );

   // définir le pipeline graphique
   matrProj.Perspective( 40.0, (GLdouble) largeur_ / (GLdouble) hauteur_, 0.1, 90.0 );
   glUniformMatrix4fv( locmatrProj, 1, GL_FALSE, matrProj ); // informer la carte graphique des changements faits à la matrice

   camera.definir();
   glUniformMatrix4fv( locmatrVisu, 1, GL_FALSE, matrVisu ); // informer la carte graphique des changements faits à la matrice

   matrModel.LoadIdentity();
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel ); // informer la carte graphique des changements faits à la matrice

   afficherFormesGeometriques();
   
   if (camera.modeLookAt)
    capturerScene(etat.capture1);
   else capturerScene(etat.capture2);

}

void creerEtat(const char* argv[], Etat& etat){

    etat.dimBoite = 10.0;
    etat.theme =  argv[1];
    etat.nombreFormes = atoi(argv[2]);
    etat.modifications = argv[3];
    etat.filename = argv[4];

    string capture1 = string("/home/camarois/git/LOG2990/server/genmulti/") + etat.filename + string("_a_ori.bmp");
    string capture2 = string("/home/camarois/git/LOG2990/server/genmulti/") + etat.filename + string("_b_ori.bmp");
    string capture3 = string("/home/camarois/git/LOG2990/server/genmulti/") + etat.filename + string("_a_mod.bmp");
    string capture4 = string("/home/camarois/git/LOG2990/server/genmulti/") + etat.filename + string("_b_mod.bmp");

    etat.capture1 = capture1;
    etat.capture2 = capture2; 
    etat.capture3 = capture3;
    etat.capture4 = capture4;
}

void FenetreTP::redimensionner( GLsizei w, GLsizei h )
{
   glViewport( 0, 0, w, h );
}

void FenetreTP::clavier( TP_touche touche )
{
   switch ( touche )
   {
   case TP_ECHAP:
   case TP_q: // Quitter l'application
      quit();
      break;

   case TP_i: // Réinitiliaser le point de vue
      camera.phi = phiInit; camera.theta = thetaInit; camera.dist = distInit;
      break;

   case TP_l: // Utiliser LookAt ou Translate+Rotate pour placer la caméra
      camera.modeLookAt = !camera.modeLookAt;
      cout << " camera.modeLookAt=" << camera.modeLookAt << endl;
      break;

   case TP_SOULIGNE:
   case TP_MOINS: // Reculer la caméra
      camera.dist += 0.1;
      break;
   case TP_PLUS: // Avancer la caméra
   case TP_EGAL:
      if ( camera.dist > 1.0 ) camera.dist -= 0.1;
      break;

   default:
      cout << " touche inconnue : " << (char) touche << endl;
      imprimerTouches();
      break;
   }
}

glm::ivec2 sourisPosPrec(0,0);
static bool pressed = false;
void FenetreTP::sourisClic( int button, int state, int x, int y )
{
   // button est un parmi { TP_BOUTON_GAUCHE, TP_BOUTON_MILIEU, TP_BOUTON_DROIT }
   // state  est un parmi { TP_PRESSE, DL_RELEASED }
   pressed = ( state == TP_PRESSE );
   switch ( button )
   {
   case TP_BOUTON_GAUCHE: // Déplacer (modifier angles) la caméra
      sourisPosPrec.x = x;
      sourisPosPrec.y = y;
      break;
   }
}

void FenetreTP::sourisMolette( int x, int y )
{
   const int sens = +1;
   camera.dist -= 0.2 * sens*y;
   if ( camera.dist < 15.0 ) camera.dist = 15.0;
   else if ( camera.dist > 70.0 ) camera.dist = 70.0;
}

int main( int argc, const char* argv[] )
{
    if (argc != 5 )
        {
            cerr << "Erreur: Nombre invalid de parametres!\n";
            cerr << "Template: main.exe geo 15 as nomFicher\n";
            return 1;
	    }
    else {
        creerEtat(argv, etat);
        if (etat.theme == "geo"){
            if(etat.nombreFormes >= 10 && etat.nombreFormes <= 200){
                srand(time(NULL));
                FenetreTP fenetre( "INF2990" );
                fenetre.initialiser();

                makeFormesGeometriques();

                fenetre.afficherScene();
                fenetre.swap();
                
                this_thread::sleep_for(chrono::seconds(3));
                camera.modeLookAt = !camera.modeLookAt;
                fenetre.afficherScene(); 
                fenetre.swap();
                
                this_thread::sleep_for(chrono::seconds(3));
                fenetre.conclure();
            }
            else {
                cerr << "Erreur: Il faut choisir entre 10 et 200 formes geometriques.\n";
                return 1;
        }
        }
        else if (etat.theme == "theme"){
            cerr << "Erreur: L'executable ne peut creer de themes pour l'instant! Essayez plutot geo.\n";
            return 1;
        }
    }

   return 0;
}