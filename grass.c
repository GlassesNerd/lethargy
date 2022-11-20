#include <math.h>
#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE float* init_grass(int base_x, int base_y, int length) {
	float* points = malloc(10 * sizeof(float)); // 5 nodes per strand of grass, x and y coordinates
	for (int i = 0; i < 5; i++) {
		points[i * 2] = base_x;
		points[i * 2 + 1] = base_y;
		base_y += length; // initializes the grass to be completely vertical, only the y coordinate changes from node to node
	}
	return points;
}

EMSCRIPTEN_KEEPALIVE float* init_velocity()
{
	float* velocity = malloc(5 * sizeof(float)); // velocity stores the current rotational velocity of each node in radians/frame 
	for (int i = 0; i < 5; i++)
	{
		velocity[i] = 0; // initially grass is not moving
	}
	return velocity;
}

EMSCRIPTEN_KEEPALIVE void physic(
	int cursorpos_x, int cursorpos_y,
	int cursordx, int cursordy,
	int max_cursorpos_x, int max_cursorpos_y,
	float* points, float* velocity, int length,
	float windvel, float random_seed)
{
	float angle[5];
	for (int i = 1; i < 5; i++) {
		float xdif = points[i * 2] - points[(i - 1) * 2];
		float ydif = points[i * 2 + 1] - points[(i - 1) * 2 + 1];
		angle[i] = atan(xdif / ydif); // angle between this segment and vertical
		velocity[i] -= 0.03 * angle[i]; // "springiness" of grass to bring it back straight
		if (cursorpos_x >= 0 && cursorpos_x <= max_cursorpos_x && cursorpos_y >= 0 && cursorpos_y <= max_cursorpos_y)  // cursor can "touch" grass only if it is in the screen
		{
			xdif = points[i * 2] - cursorpos_x; // x difference between current node and cursor
			ydif = points[i * 2 + 1] - cursorpos_y; // y difference between current node and cursor
			if (fabs(atan2(cursordx, cursordy) - angle[i]) < M_PI / 2){
				//cursordx is current horizontal velocity of cursor, cursordy is current vertical velocity of cursor
				velocity[i] += (1.0 / sqrt(xdif * xdif + ydif * ydif)) * (sin(atan2(xdif, ydif) - angle[i]) * fabs(sin(atan2(cursordx, cursordy) - angle[i]))) * sqrt(cursordx * cursordx + cursordy * cursordy) / 5; 
				//equation above takes into consideration position and velocity of cursor to affect, or "touch", the grass.
				//only components of the force perpendicular to the current grass segment are taken into consideration, hence the sin(atan2(stuff)). 
			}
		}
	}
	for (int i = 1; i < 5; i++) {
		angle[i] += velocity[i]; //calculate the new angle of the current segment from the vertical    
		srand(random_seed * 10000);
		angle[i] += i * (((rand() % 100) / 80000.0) + windvel); // calculates the effect of the wind "swaying" the grass, with some randomness added for style

		// converting angle to cartesian coordinates so that they can easily be rendered 
		points[i * 2] = points[(i - 1) * 2] + length * sin(angle[i]); 
		points[i * 2 + 1] = points[(i - 1) * 2 + 1] + length * cos(angle[i]);

		// air resistance or friction slowing down the movement of the grass
		velocity[i] *= 0.85;
	}
	for (int i = 3; i >= 1; i--) {
		for (int j = i + 1; j < 5; j++) {
			//propogating momentum up the length of the grass
			velocity[j] -= velocity[i] * 0.2;
		}
	}
	for (int i = 5; i > 1; i--) {
		//propogating momentum down the length of the grass
		velocity[i - 1] += velocity[i] * 0.1;
	}
}
