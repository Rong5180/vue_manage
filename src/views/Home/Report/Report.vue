<template>
  <div>
    <!--    面包屑导航-->
    <Breadcrumb>
      <slot slot="t1">数据统计</slot>
      <slot slot="t2">数据报表</slot>
    </Breadcrumb>
    
<!--    卡片视图区域-->
    <el-card>
      <div id="main1" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  import _ from 'lodash'
  import Breadcrumb from "../../../components/content/Breadcrumb";
  import echarts from 'echarts'
  export default {
    name: "Report",
    components:{
      Breadcrumb,
    },
    data(){
      return{
        //折线图需要合并的数据
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    async mounted() {
      var echarts = require('echarts');
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main1'));
      
      const {data:res}=await this.$http.get('reports/type/1')
      if(res.meta.status!==200)return this.$message.error( '获取折线图数据失败')
      //console.log(res)
      // 指定图表的配置项和数据
      const result=_.merge(res.data,this.options)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result);
    },
  }
</script>

<style scoped>

</style>