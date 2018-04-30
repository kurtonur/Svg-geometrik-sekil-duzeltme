$(document).ready(function(){
	
    $("div#duz:eq(0)").click(function(){
         var path=$("#svgcontent path:last");
		 var pathd=path.attr("d");
		 var duzelt=new GeoDuz(pathd,25);
		 duzelt.Sekil();
		 path.attr("d",duzelt.Sonuc);

    });
	
	$("div#duz:eq(1)").click(function(){
         var path=$("#svgcontent path:last");
		 var pathd=path.attr("d");
		 var duzelt=new GeoDuz(pathd,30);
		 path.attr("d",duzelt.KareYap());

    });
	
	$("div#duz:eq(2)").click(function(){
         var path=$("#svgcontent path:last");
		 var pathd=path.attr("d");
		 
		 /*var duzelt=new GeoDuz(pathd,30);
		 duzelt.Tolerans=5;
		 duzelt.Yontem=true;
		 duzelt.Sekil();
		 path.attr("d",duzelt.Sonuc);*/
		 
		 var duzelt=new GeoDuz(pathd,30);
		 path.attr("d",duzelt.DortYap());

    });
	
	$("div#duz:eq(3)").click(function(){
         var path=$("#svgcontent path:last");
		 var pathd=path.attr("d");
		 var duzelt=new GeoDuz(pathd,50);
		 duzelt.Tolerans=50;
		 duzelt.Sekil();
		 path.attr("d",duzelt.Sonuc);

    });
	
		
});


function GeoDuz(Kod,Hassas){
	
this.Kod=Kod;
this.Hassas=Hassas;
this.Sonuc="";
this.Tolerans=10;
this.Yontem=false;

this.Harfyoket=function(deger){
		var teknik=0;
		var yenipath="";
		var say=0;
		for(i=0;i<deger.length;i++){
			
			if(deger[i]=='L'){
			teknik=1;
			//yenipatch =yenipatch+"L";
			continue;
			}
			if(deger[i]=='C'){
			teknik=1;
			//yenipatch =yenipatch+"L";
			continue;
			}
			if(deger[i]=='M'){
			teknik=2;
			yenipatch ="M";
			continue;
			}
			if(teknik==0){
			yenipatch =yenipatch+deger[i];
			}
			if(teknik==1){
				if(deger[i]==' '){
					yenipatch =yenipatch+" ";
				say=0;	
				}
				if(say>=4){
				yenipatch =yenipatch+deger[i];	
				}
				if(deger[i]==',')say++;
			}
			if(teknik==2 && deger[i] != " "){
			
			yenipatch =yenipatch+deger[i];
			}
			
			
		}
		yenipatch=yenipatch.substring(1,yenipatch.length-1).trim();
		return yenipatch;
	}
	
this.DereceYap=function(deger){
		var derecedegeri=deger*180/Math.PI;
		return derecedegeri;
	}

this.IkiNarasiAci=function(x1,y1,x2,y2){
		var mutlakx=Math.abs(x1-x2);
		var mutlaky=Math.abs(y1-y2);
		var tandeger=mutlaky/mutlakx;
		return this.DereceYap(Math.atan(tandeger));
	}
	
this.IkiNortaNoktasi=function(x1,y1,x2,y2){
		var mutlakx=(parseFloat(x1)+parseFloat(x2))/2;
		var mutlaky=(parseFloat(y1)+parseFloat(y2))/2;
		var YeniNokta=[mutlakx,mutlaky];
		return YeniNokta;
	}	

this.IkiNarasiUzaklik=function(x1,y1,x2,y2){
		var mutlakx=Math.abs(x1-x2);
		var mutlaky=Math.abs(y1-y2);
		var uzaklik=Math.sqrt(Math.pow(mutlakx,2) + Math.pow(mutlaky,2));
		return uzaklik;
	}
	
this.VirgulAyir=function(deger){
	var xy=deger.split(",");
	return	xy;
	}

this.circlePath=function(cx, cy, r){
    return 'M '+cx+' '+cy+' m -'+r+', 0 a '+r+','+r+' 0 1,0 '+(r*2)+',0 a '+r+','+r+' 0 1,0 -'+(r*2)+',0';
}

this.DuzCiz=function(duzpathd){

		var Noktalar=duzpathd.split(" ");
		var sonhali="M";
		var aciGeri,aciIleri;
		var degisim=0;
		
		for(var i=0;i<Noktalar.length-1;i++){
		var kor1=this.VirgulAyir(Noktalar[i]);
		var kor2=this.VirgulAyir(Noktalar[(i+1)]);
		
		aciIleri = this.IkiNarasiAci(kor1[0],kor1[1],kor2[0],kor2[1]);
		
		if(i==0){aciGeri=aciIleri;sonhali=sonhali+Noktalar[i]+" L ";continue;}

		if(Hassas<Math.abs(aciIleri-aciGeri)){
		sonhali=sonhali+" "+Noktalar[i];
		degisim++;
		if(this.Yontem==true) aciGeri=aciIleri;
		}
		if(this.Yontem==false) aciGeri=aciIleri;	
		
		if(i==Noktalar.length-2) sonhali=sonhali+" "+Noktalar[i+1];
		}
		
		if(degisim==0){
		sonhali="M"+Noktalar[0]+" L"+Noktalar[Noktalar.length-1];	
		}
		
		return sonhali;
	}

this.DortYap=function(){
		var duzpathd=this.Harfyoket(this.Kod);
		var Noktalar=duzpathd.split(" ");
		var sonhali="M";
		var aciGeri,aciIleri;
		var degisim=0;
		var Kose;
		var circleUzaklik=0;
		var ilk=Noktalar[0].split(",");
		
		for(var i=0;i<Noktalar.length-1;i++){
		var kor1=this.VirgulAyir(Noktalar[i]);
		var kor2=this.VirgulAyir(Noktalar[(i+1)]);
		
		aciIleri = this.IkiNarasiAci(kor1[0],kor1[1],kor2[0],kor2[1]);
		
		if(i==0){aciGeri=aciIleri;sonhali=sonhali+Noktalar[i]+" L ";continue;}
			
		if(this.Hassas+this.Tolerans<Math.abs(aciIleri-aciGeri)){
		sonhali=sonhali+" "+Noktalar[i];
		degisim++;
		if(this.Yontem==true) aciGeri=aciIleri;
		}
		if(this.Yontem==false) aciGeri=aciIleri;	
		
		var uz=this.IkiNarasiUzaklik(ilk[0],ilk[1],kor2[0],kor2[1]);
		
		if( uz>=circleUzaklik){
			circleUzaklik=uz;
			Kose=Noktalar[(i+1)];
		}
		
		}
		Kose=Kose.split(",");
		var uzaklk=Kose[0]-ilk[0];
		if(Kose[0]-Kose[1]<=0) uzaklik=Kose[1]-ilk[1];
		
		sonhali="M "+ilk[0]+","+ilk[1]+" L "+ilk[0]+","+Kose[1]+" "+Kose[0]+","+Kose[1]+" "+Kose[0]+","+ilk[1]+" Z";
		return sonhali;
	}
	
this.KareYap=function(){
		var duzpathd=this.Harfyoket(this.Kod);
		var Noktalar=duzpathd.split(" ");
		var sonhali="M";
		var aciGeri,aciIleri;
		var degisim=0;
		var Kose;
		var circleUzaklik=0;
		var ilk=Noktalar[0].split(",");
		
		for(var i=0;i<Noktalar.length-1;i++){
		var kor1=this.VirgulAyir(Noktalar[i]);
		var kor2=this.VirgulAyir(Noktalar[(i+1)]);
		
		aciIleri = this.IkiNarasiAci(kor1[0],kor1[1],kor2[0],kor2[1]);
		
		if(i==0){aciGeri=aciIleri;sonhali=sonhali+Noktalar[i]+" L ";continue;}
			
		if(this.Hassas+this.Tolerans<Math.abs(aciIleri-aciGeri)){
		sonhali=sonhali+" "+Noktalar[i];
		degisim++;
		if(this.Yontem==true) aciGeri=aciIleri;
		}
		if(this.Yontem==false) aciGeri=aciIleri;	
		
		var uz=this.IkiNarasiUzaklik(ilk[0],ilk[1],kor2[0],kor2[1]);
		
		if( uz>=circleUzaklik){
			circleUzaklik=uz;
			Kose=Noktalar[(i+1)];
		}
		
		}
		Kose=Kose.split(",");
		var uzaklk=Kose[0]-ilk[0];
		if(Kose[0]-ilk[0]<=Kose[1]-ilk[1]) uzaklik=Kose[1]-ilk[1];
		
		sonhali="m "+ilk[0]+","+ilk[1]+" l 0,"+uzaklk+" "+uzaklk+",0 0,"+(-uzaklk)+ "z";
		return sonhali;
	}
	
this.Kapali=function(duzpathd){

		var Noktalar=duzpathd.split(" ");
		var sonhali="M";
		var aciGeri,aciIleri;
		var degisim=0;
		
		var circleUzaklik=0;
		var circleİndex=0;
		var ilk=Noktalar[0].split(",");
		
		for(var i=0;i<Noktalar.length-1;i++){
		var kor1=this.VirgulAyir(Noktalar[i]);
		var kor2=this.VirgulAyir(Noktalar[(i+1)]);
		
		aciIleri = this.IkiNarasiAci(kor1[0],kor1[1],kor2[0],kor2[1]);
		
		if(i==0){aciGeri=aciIleri;sonhali=sonhali+Noktalar[i]+" L ";continue;}
			
		if(this.Hassas+this.Tolerans<Math.abs(aciIleri-aciGeri)){
		sonhali=sonhali+" "+Noktalar[i];
		degisim++;
		if(this.Yontem==true) aciGeri=aciIleri;
		}
		if(this.Yontem==false) aciGeri=aciIleri;	
		
		var uz=this.IkiNarasiUzaklik(ilk[0],ilk[1],kor2[0],kor2[1]);
		if( uz>=circleUzaklik){
			circleUzaklik=uz;
			circleİndex=i+1;
		}
		
		}
		
		if(degisim <2){
		var son=Noktalar[circleİndex].split(",");
		var ortanokta=this.IkiNortaNoktasi(ilk[0],ilk[1],son[0],son[1]);
		var yaricap=this.IkiNarasiUzaklik(ilk[0],ilk[1],son[0],son[1])/2;
		sonhali=this.circlePath(ortanokta[0],ortanokta[1],yaricap);
		}
		else{
			sonhali=sonhali + " Z";
		}
		
		return sonhali;
	}	

this.Sekil=function(){
	
	var duzpathd=this.Harfyoket(Kod);
	var Noktalar=duzpathd.split(" ");
	var ilk=Noktalar[0].split(",");
	var son=Noktalar[Noktalar.length-1].split(",");
	var uzaklik =this.IkiNarasiUzaklik(ilk[0],ilk[1],son[0],son[1]);
	if(uzaklik <= this.Hassas+this.Tolerans)
		this.Sonuc=this.Kapali(duzpathd);
	else 
		this.Sonuc=this.DuzCiz(duzpathd);
	
	}

}






