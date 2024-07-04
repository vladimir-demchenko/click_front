import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Typography, message } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom'

export const ProxyPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage();
  const API_URL = 'http://206.188.196.107:8000'
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
  const browserApi = useMutation({
    mutationFn: (data: { id: number, body: Record<string, string> }) => axios.put(API_URL + `/browser_api/${data.id}`, data?.body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['config'] })
      queryClient.invalidateQueries({ queryKey: ['proxy'] })
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
        <a href='https://dolphin-anty.com/panel/#/api' target='_blank'>Получить токен браузера</a>

        <Form
          layout='vertical'
          onFinish={(values) => browserApi.mutate({ id: Number(id), body: values })}
        >
          <Form.Item name='browser_api'><Input placeholder='Токен браузера' /></Form.Item>
          <Form.Item><Button htmlType='submit'>Сохранить</Button></Form.Item>
        </Form>

        <Button loading={clickMutation.isPending} onClick={handleClick}>Поменять ip</Button>
      </Flex>
    </div>
  )
}