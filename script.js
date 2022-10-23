const getData= async () => {
    const response=await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");
    const data= await response.json();
    return data
};
    
  getData()
    .then(data=>render(data))
    .catch(err=> console.log)
    
    const render = arr => {
      const w = 1400;
      const h = 500;
      const padding=50;
      const minYear=d3.min(arr.monthlyVariance,d =>d.year)
      const maxYear=d3.max(arr.monthlyVariance,d =>d.year)
      const padWidth=w/(maxYear-minYear)
      const padHeigth=h/(12)
      const baseTemp=arr.baseTemperature
      const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
      const mouseover=(event,d)=>{
    
        toolTip.transition().style("opacity",.9)
    
        toolTip.style("left" , (event.pageX +0) + "px")
           .style("top" , (event.pageY +50) + "px")
           .html(`<p>${d.year}-${monthNames[d.month-1]} </p><p>  ${(baseTemp+d.variance).toFixed(1)}C° </p><p> ${(d.variance).toFixed(2) }C°</p>`)
       
          .attr("data-year", d.year)
      }; 
    
      const mouseout=()=> {
    
      toolTip.transition().style("opacity",0)

      };
    
      const xScale = d3.scaleLinear()
                    .domain([minYear,maxYear])
                    .range([0, w ]);
    
      const yScale = d3.scaleTime()
                    .domain([new Date("2001-1"),new Date("2000-1")])
                    .range([h , 0]);
    
      const xAxis = d3.axisBottom(xScale)
                   .tickFormat(d3.format("d"))
                   .ticks(30)
    
      const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%B"))
    
      const toolTip = d3.select("body")
                        .append("div")
                        .attr("id", "tooltip")
                        .style("opacity", 0)
    
      const min=d3.min(arr.monthlyVariance,d =>d.variance+arr.baseTemperature)
      const max=d3.max(arr.monthlyVariance,d =>d.variance+arr.baseTemperature)
   
      const colors = d3.scaleQuantize()
        .domain([min,max])
        .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", 
        "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);
            
        const colorsValues = d3.scaleLinear()
        .domain([min,max])
        .range([0,330])
    
        const colorAxis = d3.axisBottom(colors)
    
        const valuesAxis = d3.axisBottom(colorsValues)
                          .tickFormat(d3.format(".2f"))
                          .ticks(10)
    
        const data = d3.range(min,max,1.2);
       
    
      const svg = d3.select("body")
                .append("svg")
                .attr("id","graph")
                .attr("width", w+2*padding)
                .attr("height", h+2*padding)
                .append("g")
                .attr("transform", "translate(" + padding + "," + padding+ ")")
                
    
      svg.selectAll("rect")
         .data(arr.monthlyVariance)
         .enter()
         .append("rect")
         .attr("class","cell")
         .attr("fill", "red")
         .attr("x", (d, i) => padding+xScale(d.year) )
         .attr("y", (d) =>yScale(new Date(`2000-${d.month}`)))
         .attr("width", padWidth +"px")
         .attr("height", padHeigth)
         .attr("temp",d => baseTemp+d.variance)
         .attr("fill", d=>colors(baseTemp+d.variance))
         .attr("data-month",d =>d.month )
         .attr("data-year",d => d.year)
         .attr("data-temp",d => baseTemp+d.variance)
         .on("mouseover",mouseover)
         .on("mouseout",mouseout)
        
       
        svg.append("g")
         .attr("id","x-axis")
         .attr("transform", "translate(50," + (h) + ")")
         .call(xAxis)
         .append("text")
         .attr("x", 1000)
         .attr("dy", "2.5em")
         .attr("fill","black")
         .style("font-size", "20px")
         .text("Years");
         
        svg.append("g")
         .attr("id","y-axis")
         .attr("transform", "translate("+ padding +",0)")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", -85)
         .attr("dy", "1.5em")
         .attr("fill","black")
         .style("font-size", "20px")
         .text("Months");
    
    
         svg.append("text")
         .attr("x", 550)
         .attr("y", -20)
         .attr("id","description")
         .attr("fill","black")
         .style("font-size", "20px")
         .text(`${minYear} - ${maxYear} Base Temperature: ${8.66}`);
    
 const legend=d3.select("body")
               .append("svg")
               .attr("id","legend")
               .attr("width", 500)
               .attr("height", 100)
               .attr("transform", "translate(" + -400 + "," + 650+ ")")
               .append("g")
    
                
    
        legend.selectAll(".rects")
              .data(data)
              .enter()
              .append("rect")
              .attr("y", 20)
              .attr("height", 20)
              .attr("x", (d,i)=>20+ i*30)
              .attr("width", 30)
              .attr("fill", d=>colors(d))
        
        legend.append("g")
              .attr("id","colorAxis")
              .attr("transform", "translate(20," + 40 + ")")
              .call(valuesAxis)
              
    }