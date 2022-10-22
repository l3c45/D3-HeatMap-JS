const getData= async () => {
const response=await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");
const data= await response.json();
return data
};

getData()
.then(data=>render(data))
.catch(err=> console.log)

const render = arr => {
  const w = 1600;
  const h = 600;
  const padding=50;
  const minYear=d3.min(arr.monthlyVariance,d =>d.year)
  const maxYear=d3.max(arr.monthlyVariance,d =>d.year)
  const padWidth=w/(maxYear-minYear)
  const padHeigth=h/(12)
  const baseTemp=arr.baseTemperature

  const xScale = d3.scaleLinear()
                .domain([minYear,maxYear])
                .range([0, w ]);

  const yScale = d3.scaleTime()
                .domain([new Date("2000-12"),new Date("1999-12")])
                .range([h , 0]);

  const xAxis = d3.axisBottom(xScale)
  .tickFormat(d3.format("d"))
  .ticks(30)

  const yAxis = d3.axisLeft(yScale)
  
  .tickFormat(d3.timeFormat("%b"))
  


  const svg = d3.select("body")
            .append("svg")
            .attr("width", w+2*padding)
            .attr("height", h+2*padding)
            .append("g")
            .attr("transform", "translate(" + padding + "," + padding+ ")")
            

            svg.selectAll("rect")
     .data(arr.monthlyVariance)
     .enter()
     .append("rect")
     .attr("class","bar")
     .attr("fill", "red")
   .attr("x", (d, i) => padding+xScale(d.year) )
    .attr("y", (d) =>yScale(new Date(`2000-${d.month-1}`)))
     .attr("width", padWidth +"px")
     .attr("height", padHeigth)
     .attr("temp",d => baseTemp+d.variance)
     .attr("fill",d => baseTemp+d.variance<8?"orange":"blue")
     
    /*
     .attr("data-date",d=>d[0])
     .attr("data-gdp",d=>d[1])
     .on('mouseover', mouseoverHandler)
     .on('mouseleave', mouseoutHandler)
       */
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
.attr("id","subtitle")
.attr("fill","black")
.style("font-size", "20px")

.text(`${minYear} - ${maxYear} Base Temperature: ${8.66}`);

}