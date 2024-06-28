import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Flex, Typography, message } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom'

export const ProxyPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage();
  const API_URL = 'http://localhost:8000'
  const { data: proxy, isLoading } = useQuery({
    queryKey: ['proxy'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/proxies/${Number(id)}`
      )
      return data
    }
  });
  const clickMutation = useMutation({
    mutationFn: (data: { id: number }) => axios.post(API_URL + `/click/${data.id}`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['config'] })
      messageApi.success(data.statusText)
    }
  })
  const regex = /^http:\/\/([^:]+:[^@]+)@([^:]+:[^/]+)/

  const handleClick = () => {
    clickMutation.mutate({ id: Number(id) })
  }

  return (
    <div>
      {contextHolder}
      <Flex vertical>
        <span>IP: <Typography.Text copyable>{proxy?.url.match(regex)[2].split(':')[0]}</Typography.Text></span>
        <span>Port: <Typography.Text copyable>{proxy?.url.match(regex)[2].split(':')[1]}</Typography.Text></span>
        <span>Login: <Typography.Text copyable>{proxy?.url.match(regex)[1].split(':')[0]}</Typography.Text></span>
        <span>Password: <Typography.Text copyable>{proxy?.url.match(regex)[1].split(':')[1]}</Typography.Text></span>
        {/* <span><Typography.Text copyable>{proxy?.change_ip}</Typography.Text></span> */}
        <Button loading={clickMutation.isPending} onClick={handleClick}>Поменять ip</Button>
      </Flex>
    </div>
  )
}