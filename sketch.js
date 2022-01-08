//////////////////////////////////////////////////////////
//------------------------------------------------------//
//Vector Based Generative Art							//
//Created by Moist Kitteh with a GNU free to use license//
//------------------------------------------------------//
//////////////////////////////////////////////////////////


//Pixel size of the canvas
const H = 480;
const W = 480;

//Size of the vector field (more vectors == smoother lines, slower run time)
const NI = 100;
const NJ = 100;

//Number of steps in each line (e.g., line length)
const nstep = 50;

//Size of each step (larger number = smaller step between each vertex)
const res = 1000;

const neon = [[37,43,49],[94,102,104],[193,200,199]]
const neonstr = ['Black','Grey','Light Grey']
const neonwt = [0.25,0.35,0.4]
const sw = [.75,1,1.5]
const swstr = ['Svelte', 'Silk', 'Willowy'] 
const swwt = [0.4,0.3,0.3]
const nl = [800, 1600, 2400]
const nlwt = [0.1,0.8,0.1]
const nlstr = ['Light','Medium','Heavy']

let iters = [0,0,0]


//-------------------------------------//
//Function that sets the image features//
//-------------------------------------//
function setup(){
	createCanvas(H, W);
	
	//Randomly selecting thread color
	let rnum = fxrand()
	let w1 = 0
	for(let i = 0; i<5; i++) {
		let w2 = w1 + neonwt[i]
		if(rnum >= w1 && rnum < w2) {
			iters[0] = i
		}
		w1 = w2
	}
	stroke(neon[iters[0]]);

	//Randomly selecting thread thickness
    rnum = fxrand()
    w1 = 0
    for(let i = 0; i<4; i++) {
        w2 = w1 + swwt[i]
        if(rnum >= w1 && rnum < w2) {
            iters[1] = i
        }
        w1 = w2
    }
	strokeWeight(sw[iters[1]]);


	//Randomly selecting thread count
    rnum = fxrand()
    w1 = 0
    for(let i = 0; i<3; i++) {
        w2 = w1 + nlwt[i]
        if(rnum >= w1 && rnum < w2) {
            iters[2] = i
        }
        w1 = w2
    }
    nlines = nl[iters[2]]

	//Assigning Metadata
	window.$fxhashFeatures = {
		"Thread Color" : neonstr[iters[0]],
		"Thread Size" : swstr[iters[1]],
		"Thread Count" : nlstr[iters[2]]
	}

	//Adding background color
	background(246,250,251);
	noLoop();
}



//--------------------------------------------------------//
//Function that creates the vector field from perlin noise//
//	then draws lines through the field					  //
//--------------------------------------------------------//
function draw(){ 
	const vecs = new Array(NI).fill(0);
	for(let ii = 0; ii < NI; ii++){
		vecs[ii] = new Array(NJ).fill(0);
	}

	//Generating perlin noise
	//	for the record, there are some issues when divisions > 0...
	///
	const divisions = 0
    let np = 2+divisions;
    const grid = new Array(np-1).fill(0);
    for(let ii = 0; ii < np; ii++) {
        grid[ii] = new Array(np).fill(0)
    }
		
    for(let ii = 0; ii < np; ii++){
        for(let jj = 0; jj < np; jj++){
		let angle = fxrand()*2*Math.PI
        grid[ii][jj] = [Math.cos(angle),Math.sin(angle)]
		}
    }


    //Creating vector field
	///
    for(let ii = 0; ii < NI; ii++){
        for(let jj = 0; jj < NJ; jj++){
    		//Finding location of ii and jj within noise grid
			let i0 = Math.floor((ii/NI)*(np-1))
			let j0 = Math.floor((jj/NJ)*(np-1))
		 	let i1 = i0+1
			let j1 = j0+1	
			//enforcing periodicity
			if(i0 == np-1){
				let i1 = 0
			}
			if(j0 == np-1){
				let j1 = 0
			}
			
			//finding displacement vectors
			let u = (ii/NI)-i0/(np-1)
			let v = (jj/NJ)-j0/(np-1)
			
			//Finding dot product of gradient*displacement vectors
			let n00 = grid[i0][j0][0]*u 	 + grid[i0][j0][1]*v
			let n10 = grid[i1][j0][0]*(u-1)  + grid[i1][j0][1]*v
			let n01 = grid[i0][j1][0]*u  	 + grid[i0][j1][1]*(v-1)
			let n11 = grid[i1][j1][0]*(u-1)  + grid[i1][j1][1]*(v-1)
			

			//Interpolating with a smoothing step
			let fu = 6*(u*u*u*u*u) - 15*(u*u*u*u) + 10*(u*u*u)
			let fv = 6*(v*v*v*v*v) - 15*(v*v*v*v) + 10*(v*v*v)
			let nx0 = n00*(1-fu) + n10*(fu)
			let nx1 = n01*(1-fu) + n11*(fu)
			let nxy = nx0*(1-fv) + nx1*(fv)
			
			//Converting gradient value [-1,1] to an angle
			nxy = nxy*2*Math.PI
			//finding flow field vectors
			vecs[ii][jj] = [Math.cos(nxy),Math.sin(nxy)]
			
		}
    }


	//Drawing lines through the vector field
	///
    const lines = [];
	for(iline = 0; iline < nlines; iline++){	
		//Initializing line that all points will be added to
		let line = [];
		
		//Creating the pseudorandom seed for each line
		let pt = [Math.floor(fxrand()*NI),Math.floor(fxrand()*NJ)];
		if(pt[0] > NJ/2) {
         pt[0] - NJ/2
      }
      let xx = [(pt[0]/NI)*H,(pt[1]/NJ)*W];
		
		//Extending the line out nstep number of steps
		for(let istep = 0; istep < nstep; istep++){
			let xstep = (vecs[pt[0]][pt[1]][0]*H)/res;
			let ystep = (vecs[pt[0]][pt[1]][1]*W)/res;
			xx = [xx[0] + xstep,xx[1]+ystep];
			pt = [Math.floor(xx[0]/H*NI),Math.floor(xx[1]/W*NJ)];
			if(pt[0] < 0) {
				break;
			} else if ( pt[0] >= NI){
				break;
			} else if(pt[1] < 0) {
                break;
            } else if ( pt[1] >= NJ){
                break;
            }

			let point = {x: xx[0], y: xx[1]};
    		line.push(point)
    	}
		
		//Adding the line to the lines array
    	lines.push(line);
    }


	//Looping over and drawing all lines
	///
	for(let i = 0; i < nlines; i++){

		noFill();  //Making sure line has a 0 fill interior
		beginShape(); //Beginning drawn line "shape" that each vertex will be added to
      //Randomly selecting thread color
      let rnum = fxrand()
	   let w1 = 0
	   for(let i = 0; i<5; i++) {
	   	let w2 = w1 + neonwt[i]
	   	if(rnum >= w1 && rnum < w2) {
	   		iters[0] = i
	   	}
	   	w1 = w2
	   }
	   stroke(neon[iters[0]]);


		//Drawing and connecting each vertex of the current line
		for(let j = 0; j < lines[i].length; j++){
		curveVertex(lines[i][j].x,lines[i][j].y);
		}

		endShape();
		
	}
}

